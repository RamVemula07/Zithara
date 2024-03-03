import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    console.log(order, orderBy)
    if (orderBy === 'date') {
        return order === 'desc'
            ? (a, b) => {
                if (a['created_at'] > b['created_at']) {
                    return -1;
                }
                if (a['created_at'] < b['created_at']) {
                    return 1;
                }
                return 0;
            }
            : (a, b) => {
                if (a['created_at'] < b['created_at']) {
                    return -1;
                }
                if (a['created_at'] > b['created_at']) {
                    return 1;
                }
                return 0;
            };
    } else if (orderBy === 'time') {
        return order === 'desc'
            ? (a, b) => {
                const timeA = a['created_at'].split('T')[1];
                const timeB = b['created_at'].split('T')[1];
                return timeB.localeCompare(timeA);
            }
            : (a, b) => {
                const timeA = a['created_at'].split('T')[1];
                const timeB = b['created_at'].split('T')[1];
                return timeA.localeCompare(timeB);
            };
    } else {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
}

function stableSort(array, comparator) {
    console.log(array, comparator)
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'sno', numeric: true, label: 'ID' },
    { id: 'customer_name', numeric: false, label: 'Customer Name' },
    { id: 'age', numeric: true, label: 'Age' },
    { id: 'phone', numeric: false, label: 'Phone' },
    { id: 'location', numeric: false, label: 'Location' },
    { id: 'date', numeric: false, label: 'Date' },
    { id: 'time', numeric: false, label: 'Time' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        console.log(event, property)
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.id === 'date' || headCell.id === 'time' ? (
                            <Typography variant="subtitle2">{headCell.label}</Typography>
                        ) : (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    large: {
        width: theme.spacing(16),
        height: theme.spacing(16),
    },
    medium: {
        width: "auto",
        height: theme.spacing(10),
    },
    root: {
        margin: theme.spacing(3),
    },
    heading: {
        textAlign: 'center',
        margin: 10,
    },
    "search-container": {
        display: "flex",
        justifyContent: "flex-end",
        marginRight: 5,
        marginBottom: 5
    }
}));

export default function HostedWebsiteDisplayTable({ data }) {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchInput, setSearchInput] = useState('');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        console.log(property);
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = data.filter(row => {
        return row.customer_name.toLowerCase().includes(searchInput.toLowerCase())
            || row.location.toLowerCase().includes(searchInput.toLowerCase())
            || row.created_at.includes(searchInput);
    });

    return (
        <div className={classes.root}>
            <div className={classes['search-container']}>
                <Input
                    onChange={(event) => { setSearchInput(event.target.value) }}
                    placeholder="Search.."
                    type="search"
                    value={searchInput}
                    inputProps={{ style: { fontWeight: 'normal' } }}
                />
            </div>
            <Paper className={classes.paper}>
                <Table className={classes.table}>
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(filteredData, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="left">{row.sno}</TableCell>
                                    <TableCell align="left">{row.customer_name}</TableCell>
                                    <TableCell align="left">{row.age}</TableCell>
                                    <TableCell align="left">{row.phone}</TableCell>
                                    <TableCell align="left">{row.location}</TableCell>
                                    <TableCell align="left">{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell align="left">{new Date(row.created_at).toLocaleTimeString()}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
