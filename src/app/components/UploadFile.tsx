import {
  Button, Upload, UploadProps, message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';

interface FuncticionFetchItems {
  onFechItems(): void;
}

const UpdateFile: React.FC<FuncticionFetchItems> = ({ onFechItems }) => {
  const props: UploadProps = {
    name: 'file',
    action: `${process.env.NEXT_PUBLIC_URL_API}/api/upload`,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} arquivo enviado com sucesso!`);
        onFechItems();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} falha no upload do arquivo.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button type="primary" icon={<UploadOutlined />}>Enviar Arquivo</Button>
    </Upload>
  );
};

export default UpdateFile;
