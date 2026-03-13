program SysInspectAgent;

{$APPTYPE CONSOLE}

uses
  System.SysUtils, System.DateUtils, System.Variants, System.Classes,
  System.Win.ComObj, System.Generics.Collections, System.JSON,
  System.Net.HttpClient, System.Net.URLClient, System.NetConsts,
  Winapi.ActiveX, Winapi.Windows;

function GetWmiVariantStr(const vProp: OleVariant): string;
begin
  Result := '';
  try
    if VarIsArray(vProp) or (VarType(vProp) and varArray <> 0) then
      Result := VarToStr(vProp[VarArrayLowBound(vProp, 1)])
    else if not VarIsNull(vProp) then
      Result := Trim(VarToStr(vProp));
  except
    Result := '';
  end;
end;

function CreateFullJSONObj(const WmiObj: OleVariant): TJSONObject;
var
  PropEnum: IEnumVariant;
  PropItem: OleVariant;
  Fetched: LongWord;
  PropName: string;
begin
  Result := TJSONObject.Create;
  try
    PropEnum := IUnknown(WmiObj.Properties_._NewEnum) as IEnumVariant;
    while PropEnum.Next(1, PropItem, Fetched) = S_OK do
      begin
        PropName := string(PropItem.Name);
        Result.AddPair(PropName, GetWmiVariantStr(PropItem.Value));
        PropItem := Unassigned;
      end;
  except
  end;
end;

function GetFullJSONArr(const WMIService: OleVariant; const Query: string): TJSONArray;
var
  Items, Item: OleVariant;
  Enum: IEnumVariant;
  Fetched: LongWord;
  Unknown: IUnknown;
begin
  Result := TJSONArray.Create;
  try
    Items := WMIService.ExecQuery(Query);
    Unknown := Items._NewEnum;
    Enum := Unknown as IEnumVariant;
    while Enum.Next(1, Item, Fetched) = S_OK do
      begin
        Result.Add(CreateFullJSONObj(Item));
        Item := Unassigned;
      end;
  except
  end;
end;

function GetFullSingleJSON(const WMIService: OleVariant; const Query: string): TJSONObject;
var
  Arr: TJSONArray;
begin
  Arr := GetFullJSONArr(WMIService, Query);
  try
    if Arr.Count > 0 then
      Result := TJSONObject(Arr.Items[0].Clone)
    else
      Result := TJSONObject.Create;
  finally
    Arr.Free;
  end;
end;

function GetUsersGroupsInfo(const WMIService: OleVariant): TJSONArray;
var
  GroupUsers, Item: OleVariant;
  Enum: IEnumVariant;
  Fetched: LongWord;
  PartComp, GroupComp, UserName, GroupName: string;
  UserMap: TObjectDictionary<string, TJSONArray>;
  Pair: TPair<string, TJSONArray>;
  UserObj: TJSONObject;
begin
  Result := TJSONArray.Create;
  UserMap := TObjectDictionary<string, TJSONArray>.Create([doOwnsValues]);
  try
    try
      GroupUsers := WMIService.ExecQuery('SELECT * FROM Win32_GroupUser');
      Enum := IUnknown(GroupUsers._NewEnum) as IEnumVariant;
      while Enum.Next(1, Item, Fetched) = S_OK do
        begin
          GroupComp := VarToStr(Item.GroupComponent);
          PartComp := VarToStr(Item.PartComponent);
          GroupName := Copy(GroupComp, Pos('Name="', GroupComp) + 6, MaxInt);
          GroupName := Copy(GroupName, 1, Pos('"', GroupName) - 1);
          UserName := Copy(PartComp, Pos('Name="', PartComp) + 6, MaxInt);
          UserName := Copy(UserName, 1, Pos('"', UserName) - 1);
          if not UserMap.ContainsKey(UserName) then
            UserMap.Add(UserName, TJSONArray.Create);
          UserMap[UserName].Add(GroupName);
          Item := Unassigned;
        end;
      for Pair in UserMap do
        begin
          UserObj := TJSONObject.Create;
          UserObj.AddPair('user', Pair.Key);
          UserObj.AddPair('groups', TJSONArray(Pair.Value.Clone));
          Result.Add(UserObj);
        end;
    except
      on E: Exception do Writeln('Error mapping groups: ', E.Message);
    end;
  finally
    UserMap.Free;
  end;
end;

function GetUsersAdmin(const WMIService: OleVariant): TJSONArray;
var
  Groups, GroupItems, GroupItem: OleVariant;
  EnumG, EnumI: IEnumVariant;
  FetchedG, FetchedI: LongWord;
  AdminGroupName, PartComp, UserName: string;
begin
  Result := TJSONArray.Create;
  try
    Groups := WMIService.ExecQuery('SELECT Name FROM Win32_Group WHERE SID="S-1-5-32-544"');
    EnumG := IUnknown(Groups._NewEnum) as IEnumVariant;
    if EnumG.Next(1, GroupItem, FetchedG) = S_OK then
      begin
        AdminGroupName := VarToStr(GroupItem.Name);
        GroupItems := WMIService.ExecQuery('SELECT * FROM Win32_GroupUser');
        EnumI := IUnknown(GroupItems._NewEnum) as IEnumVariant;
        while EnumI.Next(1, GroupItem, FetchedI) = S_OK do
          begin
            if Pos('Name="' + AdminGroupName + '"', VarToStr(GroupItem.GroupComponent)) > 0 then
              begin
                PartComp := VarToStr(GroupItem.PartComponent);
                UserName := Copy(PartComp, Pos('Name="', PartComp) + 6, MaxInt);
                UserName := Copy(UserName, 1, Pos('"', UserName) - 1);
                Result.Add(UserName);
              end;
          end;
      end;
  except
  end;
end;

procedure RunInspector(const ServerURL: string);
var
  HTTP: THTTPClient;
  Payload, Vars, Input: TJSONObject;
  RequestStream: TStringStream;
  Response: IHTTPResponse;
  WMIService, Locator: OleVariant;
  CurrentYear: Word;
begin
  CurrentYear := YearOf(Now);

  Writeln('PC SysInspector Agent [Version 1.0.0.0]');
  Writeln('(c) Helpdesk ', CurrentYear, '. All rights reserved.');
  Writeln;

  try
    Locator := CreateOleObject('WbemScripting.SWbemLocator');
    WMIService := Locator.ConnectServer('.', 'root\cimv2');
  except
    on E: Exception do
      begin
        Writeln('WMI Error: ', E.Message);
        Exit;
      end;
  end;

  Payload := TJSONObject.Create;
  try
    Vars := TJSONObject.Create;
    Input := TJSONObject.Create;

    Writeln('Collecting system information...');

    Input.AddPair('baseboard', GetFullSingleJSON(WMIService, 'SELECT * FROM Win32_BaseBoard'));
    Input.AddPair('bios', GetFullSingleJSON(WMIService, 'SELECT * FROM Win32_BIOS'));
    Input.AddPair('os', GetFullSingleJSON(WMIService, 'SELECT * FROM Win32_OperatingSystem'));
    Input.AddPair('cpu', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_Processor'));
    Input.AddPair('memorychip', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_PhysicalMemory'));
    Input.AddPair('diskdrive', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_DiskDrive'));
    Input.AddPair('netadapter', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_NetworkAdapter'));
    Input.AddPair('display', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_DesktopMonitor'));
    Input.AddPair('videoadapter', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_VideoController'));
    Input.AddPair('sound', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_SoundDevice'));
    Input.AddPair('useraccount', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_UserAccount'));
    Input.AddPair('share', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_Share'));
    Input.AddPair('printer', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_Printer'));
    Input.AddPair('product', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_Product'));
    Input.AddPair('fixupdate', GetFullJSONArr(WMIService, 'SELECT * FROM Win32_QuickFixEngineering'));
    Input.AddPair('usergroup', GetUsersGroupsInfo(WMIService));
    Input.AddPair('useradmin', GetUsersAdmin(WMIService));

    Vars.AddPair('input', Input);
    Payload.AddPair('query', 'mutation CreateInspector($input: CreateInspectorInput!) { createOneInspector(input: $input) }');
    Payload.AddPair('variables', Vars);

    HTTP := THTTPClient.Create;
    Writeln('Sending system information...');
    try
      RequestStream := TStringStream.Create(Payload.ToString, TEncoding.UTF8);
      try
        HTTP.ContentType := 'application/json';
        Response := HTTP.Post(ServerURL, RequestStream);
        Writeln('Response information: ', Response.StatusCode, ' ', Response.StatusText);
        Writeln('GraphQL Details: ', Response.ContentAsString);
      finally
        RequestStream.Free;
      end;
    finally
      HTTP.Free;
    end;
  finally
    Payload.Free;
  end;
end;

var
  TargetURL: string;

begin
  CoInitialize(nil);

  try
    if ParamCount > 0 then TargetURL := ParamStr(1)
    else Exit;
    RunInspector(TargetURL);
  finally
    CoUninitialize;
  end;
end.
