import { FC, ChangeEvent } from 'react';
import { BiCloudUpload } from 'react-icons/bi';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';


interface FromProps {
  mode: string;
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
  setUploadImage: (image: File | null) => void;
}

const Form: FC<FromProps> = ({ mode, imageUrl, setImageUrl, setUploadImage }) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];

      setImageUrl(URL.createObjectURL(image));
      setUploadImage(image);
    }
  };

  switch (mode) {
    case 'command':
    case 'text':
      return (
        <OutlinedInput
          id="message"
          name="message"
          autoComplete="off"
          fullWidth
        />
      );
    case 'image':
      return (
        <>
          <label htmlFor="image" style={{ width: '100%', height: '100%' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="image"
              onChange={handleImageChange}
            />
            <Button
              variant="contained"
              component="span"
              fullWidth
              startIcon={<BiCloudUpload />}
            >
              上傳照片
            </Button>
          </label>
          <Box>
            {(imageUrl === '') ? (
              <Skeleton
                variant="rounded"
                width="300px"
                height="180px"
              />
            ) : (
              <img
                src={imageUrl}
                alt="uploadImage"
                width="300px"
                height="180px"
              />
            )}
          </Box>
        </>
      );
    default:
      return (
        <></>
      );
  }
}

export default Form;