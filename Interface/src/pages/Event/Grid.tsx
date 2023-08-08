import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { BiTrash } from 'react-icons/bi';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Event from '../../api/Event';


type EventType = {
  id: string;
  devices: string;
  datetime: string;
  mode: string;
  message: string;
}

const Grid: FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    Event.get(setEvents);
  }, []);

  const deleteEvent = useCallback(
    (id: string) => () => {
      setTimeout(async () => {
        Event.remove(id);

        setEvents((events) => events.filter((event) => event.id !== id));
      });
    },
    []
  );

  const field = useMemo<GridColDef<EventType>[]>(
    () => [
      { field: 'id', headerName: '編號', width: 150 },
      { field: 'devices', headerName: '裝置', width: 150, editable: true },
      { field: 'datetime', headerName: '排程時間', width: 250, editable: true },
      { field: 'mode', headerName: '模式', width: 150, editable: true },
      { field: 'message', headerName: '訊息', width: 150, editable: true },
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
            onClick={deleteEvent(params.row.id)}
          />
        ]
      }
    ],
    [deleteEvent]
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
            md: '50vw'
          },
          borderRadius: 4,
          boxShadow: {
            md: '0 4px 8px 0 #BDC9D7'
          }
        }}>
        <DataGrid
          columns={field}
          rows={events}
          editMode="row"
          slots={{
            toolbar: GridToolbar
          }}
          // processRowUpdate={editDevice}
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


export default Grid;