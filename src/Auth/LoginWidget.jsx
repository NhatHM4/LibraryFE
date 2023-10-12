import { Redirect } from 'react-router-dom';
import { useOktaAuth} from '@okta/okta-react'
import SpinLoading from '../layouts/Utils/SpinLoading';
import OktaSignInWidget from './OktaSignInWidget';

const LoginWidget = ({config}) =>{
    const {oktaAuth, authState} = useOktaAuth();
    const onSuccess = ( tokens ) =>{
        oktaAuth.handleLoginRedirect(tokens)
    };

    const onError = (err) =>{
        console.log('sign in error ', err)
    }

    if (!authState){
        return (<SpinLoading/>)
    }

    return authState.isAuthenticated ?
    <Redirect to={{pathname:'/'}}/>
    :
    <OktaSignInWidget config = {config} onError={onError} onSuccess={onSuccess} />
}

export default LoginWidget

