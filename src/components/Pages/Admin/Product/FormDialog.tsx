import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import { IProduct } from 'interfaces/models/product';
import React, { forwardRef, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import productService from 'services/product';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
  product?: IProduct;
  onComplete: (product: IProduct) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(50),
  quant: yup.string().required().min(3).max(50),
  cod: yup.string().required().min(3).max(150),
  price: yup.string().required().min(3).max(150)
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IProduct>({
    validationSchema,
    onSubmit(model) {
      return productService.save(model).pipe(
        tap(product => {
          Toast.show(`${product.name} foi salvo${model.id ? '' : ', um produto foi enviado'}`);
          props.onComplete(product);
        }),
        logError(true)
      );
    }
  });

  const handleEnter = useCallback(() => {
    formik.setValues(props.product ?? formik.initialValues, false);
  }, [formik, props.product]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Produtos</DialogTitle>
        <DialogContent className={classes.content}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label='name' name='name' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='portion' name='portion' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='sku' name='sku' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='status' name='status' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='category' name='category' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='price' name='price' formik={formik} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
