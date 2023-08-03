import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { BiTrash } from 'react-icons/bi';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Device from '../api/Device';


type DeviceType = {
  id: number,
  name: string,
  macId: string
}

const DeviceGrid: FC = () => {
  const [devices, setDevices] = useState<DeviceType[]>([]);

  useEffect(() => {
    Device.get(setDevices);
  }, []);

  const deleteDevice = useCallback(
    (name: string) => () => {
      setTimeout(() => {
        Device.remove(name);

        setDevices((devices) => devices.filter((device) => device.name !== name));
      });
    },
    []
  );

  const editDevice = (newRow: DeviceType, oldRow: DeviceType) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      Device.update(oldRow.name, newRow.name, oldRow.macId, newRow.macId);
    }

    return newRow;
  }

  const field = useMemo<GridColDef<DeviceType>[]>(
    () => [
      { field: 'name', headerName: '裝置名稱', width: 150, editable: true },
      { field: 'macId', headerName: 'Mac ID', width: 250, editable: true },
      {
        field: 'actions',
        type: 'actions',
        headerName: '功能',
        width: 150,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<BiTrash style={{
              fontSize: '20px'
            }} />}
            label="remove"
            onClick={deleteDevice(params.row.name)}
          />
        ]
      }
    ],
    [deleteDevice]
  );

  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: "center",
      alignItems: 'center'
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: {
            xs: '100%',
            sm: '100%',
            md: '650px'
          },
          borderRadius: 4,
          boxShadow: {
            md: '0 4px 8px 0 #BDC9D7'
          }
        }}>
        <DataGrid
          columns={field}
          rows={devices}
          editMode="row"
          slots={{
            toolbar: GridToolbar
          }}
          processRowUpdate={editDevice}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 4,
            fontSize: '16px'
          }} />
      </Box>
    </Box>
  );
}


export default DeviceGrid;