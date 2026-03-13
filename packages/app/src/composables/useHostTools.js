import { useApolloClient } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';

import { GET_LINK_PING, GET_LINK_RDP, GET_LINK_VNC } from '@/graphql/apollo.gql';

export function useHostTools() {
  const { resolveClient } = useApolloClient();
  const toast = useToast();

  const downloadFile = (base64Content, fileName, mimeType = 'text/plain') => {
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    try {
      link.click();
    } finally {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleLinkRequest = async (gqlQuery, host, fileName) => {
    if (!host) {
      toast.add({
        severity: 'warn',
        summary: 'Попередження',
        detail: 'Хост не вказано',
        life: 3000
      });
      return;
    }

    const client = resolveClient();

    try {
      const { data } = await client.query({
        query: gqlQuery,
        variables: { host },
        fetchPolicy: 'no-cache'
      });

      const content = data ? Object.values(data)[0] : null;

      if (!content) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Файл порожній',
          life: 3000
        });
        return;
      }

      downloadFile(content, fileName);

      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: `${fileName} файл створено`,
        life: 3000
      });
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Не вдалося завантажити дані',
        life: 3000
      });
    }
  };

  const getPINGLink = host => handleLinkRequest(GET_LINK_PING, host, `PING_${host}.cmd`);

  const getRDPLink = host => handleLinkRequest(GET_LINK_RDP, host, `RDP_${host}.rdp`);

  const getVNCLink = host => handleLinkRequest(GET_LINK_VNC, host, `VNC_${host}.vnc`);

  return {
    getPINGLink,
    getRDPLink,
    getVNCLink
  };
}
