import dialogs from 'ui/dialogs';
import { fetch } from 'fetch';
import validator from 'email-validator';
import Component from 'nativescript-component';
import config from '../../shared/config';
import handleHttpErrors from '../../shared/utils/handleHttpErrors';

class Register extends Component {

    init() {
        this.set('email', '');
        this.set('password', '');
    }

    completeRegistration() {

        // From the `register()` method that was originally in user-view-model.
        return fetch(`${config.apiUrl}Users`, {
            method: 'POST',
            body: JSON.stringify({
                Username: this.get('email'),
                Email: this.get('email'),
                Password: this.get('password')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(handleHttpErrors)
        .then(() => dialogs.alert('Your account was successfully created.'))
        .then(() => this.navigate({ component: 'login' }))
        .catch(error => {
            console.log(error);
            dialogsModule.alert({
                message: 'Unfortunately we were unable to create your account.',
                okButtonText: 'OK'
            });
        });
    }

    register() {

        let email = this.get('email');
        let isValidEmail = validator.validate(email);

        if (isValidEmail) {
            return this.completeRegistration();
        } else {
            return dialogsModule.alert({
                message: 'Enter a valid email address.',
                okButtonText: 'OK'
            });
        }
    }
}

Register.export(exports);
