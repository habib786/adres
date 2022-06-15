import * as React from 'react';
import { useEffect  } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

interface Column {
  id: 'logId' | 'applicationType' | 'applicationId' | 'action' | 'actionDetails' | 'dateTime';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'logId', label: 'Log Id', minWidth: 170 },
  { id: 'applicationType', label: 'Application Type', minWidth: 100 },
  {
    id: 'applicationId',
    label: 'Application Id',
    minWidth: 170,
    // format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    // format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'actionDetails',
    label: 'Action Details',
    minWidth: 170,
    // format: (value: number) => value.toFixed(2),
  },
  { id: 'dateTime', label: 'Date : Time', minWidth: 170 },
];

interface Data {
    logId: string;
    applicationType: string;
    applicationId: number;
    action: number;
    actionDetails: number;
    dateTime: string;
    actionType?: string;
    creationTimestamp?: string;
}

function createData(
    logId: string,
    applicationType: string,
    applicationId: number,
    action: number,
    actionDetails: number,
    dateTime: string,
): Data {
  return { logId, applicationType, applicationId, action, actionDetails, dateTime };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>( order: Order, orderBy: Key ): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ColumnGroupingTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('logId');
  const [actionTypes, setActionTypes] = React.useState<string[]>([]);
  const [applicationTypes, setApplicationTypes] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [isLoaded, setIsLoaded] = React.useState<Boolean>(false);
  const [filterOption, setFilterOption] = React.useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = React.useState<Boolean>(false);
  const [employeeName, setEmployeeName] = React.useState<String>('');
  const [actionType, setActionType] = React.useState<String>('');
  const [applicationType, setApplicationType] = React.useState<String>('');
  const [fromDate, setFromDate] = React.useState<Date>(new Date(0));
  const [toDate, setToDate] = React.useState<Date>(new Date());
  const [applicationId, setApplicationId] = React.useState<String>('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    console.log('createSortHandler called');
    const isAsc = orderBy === property && order === 'asc';
    console.log('isAsc', isAsc);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  useEffect(() => {
    callAPI();
  })

  const callAPI = async () => {
    try {
      const res = await fetch(`https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f`);
      const data = await res.json();
      
      if(data && data.result && data.result.auditLog && data.result.auditLog.length && !isLoaded){
        
        let action_types: string[] = [];
        let application_types: string[] = [];
        let r: Data[] = rows;

        data.result.auditLog.forEach((log: Data) => {
          r.push(createData( log.logId, log.applicationType, log.applicationId, log.actionType, '-/-', log.creationTimestamp ));
          if((action_types.indexOf(log.actionType) === -1) && log.actionType && log.actionType.length) { action_types.push(log.actionType); }
          if((application_types.indexOf(log.applicationType) === -1) && log.applicationType && log.applicationType.length) { application_types.push(log.applicationType); }
        })

        setRows(r);
        setIsLoaded(true);
        setActionTypes(action_types);
        setApplicationTypes(application_types);
      }
    } 
    catch (err) { console.log('error from API: ', err); }
  }

  const stableSort = (array: any, comparator: any) => {
    console.log('formSubmitted', formSubmitted);

    const stabilizedThis = array
      .filter((el: any) => {
        if(!employeeName && !actionType && !applicationType && !fromDate && !toDate && !applicationId){ return el; }
        else {
          
          console.log('employeeName', employeeName);
          console.log('actionType', actionType);
          console.log('applicationType', applicationType);
          console.log('fromDate', fromDate);
          console.log('toDate', toDate);
          console.log('applicationId', applicationId);

          // console.log('filter_option', filter_option);
          console.log('el', el);
          
          let filter_array = []

          if(employeeName && employeeName.length) {}

          if(actionType && actionType.length) {
            if(el.action === actionType){ filter_array.push(true); }
            else { filter_array.push(false); }
          }

          if(applicationType && applicationType.length) {
            if(el.applicationType === applicationType) { filter_array.push(true); }
            else { filter_array.push(false); }
          }

          if(fromDate) {
            if(el.dateTime && el.dateTime.length) { 
              console.log('el.dateTime', el.dateTime);
              console.log('new Date(el.dateTime)', new Date(el.dateTime));
              console.log('(new Date(el.dateTime) >= new Date(fromDate)', new Date(el.dateTime) >= new Date(fromDate));
              if(new Date(el.dateTime) >= new Date(fromDate)){ filter_array.push(true); }
              else { filter_array.push(false); }
            }
            else { filter_array.push(false); }
          }

          if(toDate) {
            if(el.dateTime && el.dateTime.length) { 
              console.log('el.dateTime', el.dateTime);
              console.log('new Date(el.dateTime)', new Date(el.dateTime));
              console.log('new Date(el.dateTime) <= new Date(toDate)', new Date(el.dateTime) <= new Date(toDate));
              if(new Date(el.dateTime) <= new Date(toDate)){ filter_array.push(true); }
              else { filter_array.push(false); }
            }
            else { filter_array.push(false); }
          }

          if(applicationId && applicationId.length) {
            if(el.applicationId) {
              let r = el.applicationId.toString();
              let c = r.includes(applicationId);
              
              filter_array.push(c);
            }
            else { filter_array.push(false); }
          }

          if(filter_array.indexOf(false) === -1){ return el; }
        }
      })
      .map((el: any, index: number) => [el, index] as [T, number]);
    
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) { return order; }
      return a[1] - b[1];
    });
    
    // setFormSubmitted(false);

    return stabilizedThis.map((el: any) => el[0]);
  }

  const onSearchLogger = () => {
    // let filter_array = [true, employeeName.target.value || null, actionType || null, applicationType || null, fromDate.target.value || null, toDate.target.value || null, applicationId.target.value || null];
    // setFilterOption(filter_array);
    setFormSubmitted(true);
  }

  const handleEmployeeNameChange = (event: any) => { setEmployeeName(event.target.value); }
  const handleActionTypeChange = (event: any) => { setActionType(event.target.value) }
  const handleApplicationTypeChange = (event: any) => { setApplicationType(event.target.value) }
  const handleFromDateChange = (event: any) => { setFromDate(event.target.value) }
  const handleToDateChange = (event: any) => { setToDate(event.target.value) }
  const handleApplicationIdChange = (event: any) => { setApplicationId(event.target.value) }
  const handleResetForm = () => {
    setEmployeeName('');
    setActionType('');
    setApplicationType('');
    setFromDate(new Date(0));
    setToDate(new Date());
    setApplicationId('');
  }  

  return (
    <Paper sx={{ width: '100%' }}>
        <form style={{ paddingTop: '20px' }}>
          <FormControl sx={{ m: 1, width: 175 }}>
            <TextField id="outlined-required" label="Employee Name" placeholder='e.g. Admin, User' size="small" value={employeeName} onChange={handleEmployeeNameChange}/>
          </FormControl>
          
          <FormControl sx={{ m: 1, width: 175 }} size="small">
            <InputLabel id="demo-simple-select-label">Action Type</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={actionType} label="Action Type" onChange={handleActionTypeChange}>
              {actionTypes.map((action_type, index) => <MenuItem value={action_type} key={index}>{action_type}</MenuItem> )}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, width: 175 }} size="small">
            <InputLabel id="demo-simple-select-label">Application Type</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={applicationType} label="Application Type" onChange={handleApplicationTypeChange}>
              {applicationTypes.map((application_type, index) => <MenuItem value={application_type} key={index}>{application_type}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, width: 175 }}>        
            <TextField
              id="date"
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={handleFromDateChange}
              size="small"/>
          </FormControl>

          <FormControl sx={{ m: 1, width: 175 }}>        
            <TextField
              id="date"
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={handleToDateChange}
              size="small"/>
          </FormControl>

          <FormControl sx={{ m: 1, width: 175 }}>
            <TextField id="outlined-required" label="Application Id" placeholder='e.g. 219841/2021' size="small" value={applicationId} onChange={handleApplicationIdChange}/>
          </FormControl>

          <FormControl sx={{ m: 1, width: 175 }} style={{ float: 'right', margin: '0 13px 0 0px'}}>
            <Button variant="contained" onClick={handleResetForm}>Reset</Button>
          </FormControl>
        </form>
        
        <Divider variant="middle" style={{width:'100%', margin: '50px 0 10px 0px'}}/>

        <TableContainer >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                      <TableSortLabel active={true} direction={orderBy === column.id ? order : 'asc'} onClick={createSortHandler(column.id)} >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>))}
                </TableRow>
            </TableHead>

            <TableBody>
                {stableSort(rows, getComparator(order, orderBy), formSubmitted, filterOption)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((row, index) => { return row })
                .map((row, index) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                        const value = row[column.id];
                        return (
                            <TableCell key={column.id} align={column.align}>{column.format && typeof value === 'number' ? column.format(value) : value}</TableCell>
                        );
                        })}
                    </TableRow>
                    );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Paper>
  );
}
