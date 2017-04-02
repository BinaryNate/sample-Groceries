import dialogs from 'ui/dialogs';
import frames from 'ui/frame';
import { fetch } from 'fetch';
import Component from 'nativescript-component';
import config from '../../shared/config';
import handleHttpErrors from '../../shared/utils/handleHttpErrors';

class Login extends Component {

    init() {

        if (this.view.ios) {
            let navigationBar = frames.topmost().ios.controller.navigationBar;
            navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
        }

        this.set('email', '');
        this.set('password', '');
    }

    signIn() {

        // From the `login()` method that was originally in user-view-model.
        return fetch(`${config.apiUrl}oauth/token`, {
            method: 'POST',
            body: JSON.stringify({
                username: this.get('email'),
                password: this.get('password'),
                grant_type: 'password'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(handleHttpErrors)
        .then(response => response.json())
        .then(data => {
            config.token = data.Result.access_token;
        })
        .catch(error => {
            console.log(error);
            dialogs.alert({
                message: 'Unfortunately we could not find your account.',
                okButtonText: 'OK'
            });
            throw error;
        })
        .then(() => {
            this.navigate({ component: 'Register' });
        });
    }

    register() {
        this.navigate('views/register/register');
    }
}

Login.export(exports);
