import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import SearchField from 'components/Shared/Pagination/SearchField';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import {ISupplier} from 'interfaces/models/supplier';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { Fragment, memo, useCallback, useState } from 'react';
import supplierService from 'services/supplier';

import FormDialog from '../FormDialog';
import ListItem from './ListSupplier';

const SupplierListPage = memo(() => {
  const [formOpened, setFormOpened] = useState(false);
  const [current, setCurrent] = useState<ISupplier>();

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => supplierService.list(params),
    { orderDirection: 'asc' },
    []
  );

  const formCallback = useCallback(
    (supplier?: ISupplier) => {
      setFormOpened(false);
      current ? refresh() : mergeParams({ term: String(supplier.email) });
    },
    [current, mergeParams, refresh]
  );

  const formCancel = useCallback(() => setFormOpened(false), []);
  const handleRefresh = useCallback(() => refresh(), [refresh]);

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <Fragment>
      <Toolbar title='Fornecedores' />

      <Card>
        <FormDialog opened={formOpened} supplier={current} onComplete={formCallback} onCancel={formCancel} />

        <CardLoader show={loading} />

        <CardContent>
          <Grid container justify='space-between' alignItems='center' spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <TableWrapper minWidth={500}>
          <Table>
            <TableHead>
              <TableRow>
              {/*<TableCell>{supplier.personName}</TableCell>
              <TableCell>{supplier.supplierName}</TableCell>
              <TableCell>{supplier.cnpj}</TableCell>
              <TableCell>{supplier.cell1}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.productName}</TableCell>*/}
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='personName'>
                  Nome do responsavel
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='supplierName'>
                  Nome da empresa
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='cnpj'>
                  cnpj
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='cell1'>
                  Telefone para contato
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='email'>
                  email
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='productName'>
                  Produtos
                </TableCellSortable>
                <TableCellActions>
                  <IconButton disabled={loading} onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </TableCellActions>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAndErrorMessages
                colSpan={3}
                error={error}
                loading={loading}
                hasData={results.length > 0}
                onTryAgain={refresh}
              />
              {results.map(supplier => (
                <ListItem key={supplier.id} supplier={supplier} onEdit={handleEdit} onDeleteComplete={refresh} />
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
      </Card>
    </Fragment>
  );
});

export default SupplierListPage;
