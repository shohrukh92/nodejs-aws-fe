import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';

const isFileCSV = (file: File) => {
  // hack for Windows OS, because sometimes the mime type is null
  const CSV_MIME_TYPES = ['text/csv', 'application/vnd.ms-excel'];
  return CSV_MIME_TYPES.includes(file.type) || file.name.endsWith('.csv');
}

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
    if (isFileCSV(file)) {
      const signedUrlResponse = await axios({
        method: 'GET',
        url,
        params: {
          name: encodeURIComponent(file.name)
        }
      });

      console.log('File to upload: ', file.name);
      console.log("Uploading to: ", signedUrlResponse.data.url);

      const result = await axios(signedUrlResponse.data.url, {
        method: 'PUT',
        data: file,
        headers: { 'Content-Type': 'text/csv' },
      });

      console.log('Result: ', result);
    } else {
      console.error('File format should be CSV');
    }
    setFile('');
  };

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
