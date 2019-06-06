import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DropdownMenu from 'components/Shared/DropdownMenu';
import { WithStyles } from 'decorators/withStyles';
import { IUserToken } from 'interfaces/userToken';
import ExitToAppIcon from 'mdi-react/ExitToAppIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import React, { Fragment, PureComponent } from 'react';
import rxjsOperators from 'rxjs-operators';
import authService from 'services/auth';

import { DrawerContext, IDrawerContext } from '.';

interface IProps {
  user: IUserToken;
  classes?: any;
}

@WithStyles(theme => ({
  root: {
    textAlign: 'left',
    color: theme.palette.primary.contrastText,
    width: '100%'
  },
  text: {
    padding: '8px 15px 0 15px',
    lineHeight: 'normal'
  },
  textSmall: {
    display: 'block',
    marginBottom: '2px'
  }
}))
export default class AppDrawerUser extends PureComponent<IProps> {
  drawer: IDrawerContext;

  constructor(props: IProps) {
    super(props);
    this.state = { user: null };
  }

  handleChangePassword = () => {
    authService.openChangePassword();
  }

  handleLogout = () => {
    this.drawer.close();

    authService.logout().pipe(
      rxjsOperators.logError(),
      rxjsOperators.bindComponent(this)
    ).subscribe();
  }

  render() {
    const { classes, user } = this.props;

    if (!user) {
      return null;
    }

    return (
      <Fragment>
        <DrawerContext.Consumer>
          {drawer => (this.drawer = drawer) && null}
        </DrawerContext.Consumer>

        <Grid container className={classes.root} wrap='nowrap'>
          <Grid item xs={true} >
            <Typography variant='body2' color='inherit' className={classes.text}>
              <small className={classes.textSmall}>Bem vindo</small>
              {user.firstName}
            </Typography>
          </Grid>
          <Grid item>
            <DropdownMenu options={[{
              text: 'Trocar senha',
              icon: KeyVariantIcon,
              handler: this.handleChangePassword
            }, {
              text: 'Sair',
              icon: ExitToAppIcon,
              handler: this.handleLogout
            }]} />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}