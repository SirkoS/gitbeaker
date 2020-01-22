import FormData from 'form-data';
import { BaseService, RequestHelper, Sudo, BaseRequestOptions } from '../infrastructure';

export interface UploadMetadata {
  filename?: string;
  contentType?: string;
}

export class ProjectImportExport extends BaseService {
  download(projectId: string | number, options?: Sudo) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.get(this, `projects/${pId}/export/download`, options);
  }

  exportStatus(projectId: string | number, options?: Sudo) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.get(this, `projects/${pId}/export`, options);
  }

  import(content: string, path: string, options?: Sudo) {
    const form = new FormData();

    const defaultMetadata: UploadMetadata = {
      filename: `${Date.now().toString()}.tar.gz`,
      contentType: 'application/octet-stream',
    };

    form.append('file', content, defaultMetadata);
    form.append('path', path);
    if (options) {
      ['namespace', 'name', 'overwrite', 'overwrite', 'override_params'].forEach(key => {
        if (key in options) {
          form.append(key, options[key]);
        }
      });
    }

    return RequestHelper.post(this, 'projects/import', { ...options, form });
  }

  importStatus(projectId: string | number, options?: Sudo) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.get(this, `projects/${pId}/import`, options);
  }

  schedule(projectId: string | number, options?: BaseRequestOptions) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.post(this, `projects/${pId}/export`, options);
  }
}
