import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import {ISupplier} from 'interfaces/models/supplier';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import supplierService from 'services/supplier';

interface IProps {
  supplier: ISupplier;
  onEdit: (supplier: ISupplier) => void;
  onDeleteComplete: () => void;
}

const ListItem = memo((props: IProps) => {
  const { supplier, onEdit, onDeleteComplete } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handleEdit = useCallback(() => {
    onEdit(supplier);
  }, [onEdit, supplier]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o fornecedor ${supplier.supplierName}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => supplierService.delete(supplier.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${supplier.supplierName} foi removido`);
          setLoading(true);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Editar', icon: EditIcon, handler: handleEdit },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleEdit]);

  if (deleted) {
    return null;
  }

  return (
    // personName: string;
    // cnpj: number;
    // supplierName: string;
    // email: string;
    // cell1: number;
    // cell2?: number;
    // logoUrl?: string;
    // productName: string[];
    // // Adress
    // zipCode: number;
    // address: string;
    // number: string;
    // neighborhood: string;
    // complement?: string;
    // city: string;
    // state: string;
    <TableRow>
      <TableCell>{supplier.personName}</TableCell>
      <TableCell>{supplier.supplierName}</TableCell>
      <TableCell>{supplier.cnpj}</TableCell>
      <TableCell>{supplier.cell1}</TableCell>
      <TableCell>{supplier.email}</TableCell>
      <TableCell>{supplier.productName}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItem;
