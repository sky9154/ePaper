import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { BiTrash } from 'react-icons/bi';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Device from '../api/Device';


type DeviceType = {
  id: number,
  name: string,
  macAddress: string
}

const CustomToolbar: FC = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
  </GridToolbarContainer>
);

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
      Device.update(oldRow.macAddress, newRow.name);
    }

    return newRow;
  }

  const field = useMemo<GridColDef<DeviceType>[]>(
    () => [
      {
        field: 'name',
        headerName: '裝置名稱',
        align: 'center',
        headerAlign: 'center',
        width: 150,
        editable: true
      },
      {
        field: 'macAddress',
        headerName: 'Mac 地址',
        align: 'center',
        headerAlign: 'center',
        width: 200
      },
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box
        sx={{
          width: {
            xs: '80vw',
            sm: '80vw',
            md: '600px'
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
            toolbar: CustomToolbar
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