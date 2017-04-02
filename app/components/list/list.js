import dialogs from 'ui/dialogs';
import { ObservableArray } from 'data/observable-array';
import Component from 'nativescript-component';
import socialShare from 'nativescript-social-share';
import config from '../../shared/config';
import handleHttpErrors from '../../shared/utils/handleHttpErrors';
import swipeDelete from '../../shared/utils/ios-swipe-delete';

class List extends Component {

    init() {

        let groceryList = new ObservableArray();
        this.set('groceryList', groceryList);
        let listView = this.view.getViewById('groceryList');

        if (this.view.ios) {
            swipeDelete.enable(listView, index => this.deleteItemByIndex(index));
        }
        this.emptyList();
        this.set('isLoading', true);

        return this.loadList()
        .then(() => {
            this.set('isLoading', false);
            listView.animate({
                opacity: 1,
                duration: 1000
            });
        });
    }

    add() {

        let grocery = this.get('grocery');

        // Check for empty submissions
        if (grocery.trim() === '') {
            return dialogs.alert({
                message: 'Enter a grocery item',
                okButtonText: 'OK'
            });
        }

        // Dismiss the keyboard
        this.view.getViewById('grocery').dismissSoftInput();

        // From the `add()` method that was originally in grocery-list-view-model
        return fetch(`${config.apiUrl}Groceries`, {
            method: 'POST',
            body: JSON.stringify({
                Name: grocery
            }),
            headers: {
                'Authorization': 'Bearer ' + config.token,
                'Content-Type': 'application/json'
            }
        })
        .then(handleHttpErrors)
        .then(response => response.json())
        .then(data => {
            this.get('groceryList').push({ name: grocery, id: data.Result.Id });
        })
        .catch(error => {
            console.log(error);
            dialogs.alert({
                message: 'An error occurred while adding an item to your list.',
                okButtonText: 'OK'
            });
        })
        // Empty the input field
        .then(() => this.set('grocery', ''));
    }

    share() {

        let groceryList = this.get('groceryList');
        let list = [];
        let finalList = '';
        for (let i = 0, size = groceryList.length; i < size ; i++) {
            list.push(groceryList.getItem(i).name);
        }
        let listString = list.join(', ').trim();
        socialShare.shareText(listString);
    }

    loadList() {

        return fetch(`${config.apiUrl}Groceries`, {
            headers: {
                'Authorization': 'Bearer ' + config.token
            }
        })
        .then(handleHttpErrors)
        .then(response => response.json())
        .then(data => {
            let groceryList = this.get('groceryList');

            data.Result.forEach(grocery => {
                groceryList.push({
                    name: grocery.Name,
                    id: grocery.Id,
                    // Pass the child list-item component a function it can use to delete itself.
                    deleteItem: this.deleteItem.bind(this)
                });
            });
        });
    };

    emptyList() {

        let groceryList = this.get('groceryList');

        while (groceryList.length) {
            groceryList.pop();
        }
    };

    deleteItem(item) {
        let index = this.get('groceryList').indexOf(item);
        return this.deleteItemByIndex(index);
    }

    deleteItemByIndex(index) {

        let groceryList = this.get('groceryList');

        let { id } = groceryList.getItem(index);

        return fetch(`${config.apiUrl}Groceries/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + config.token,
                'Content-Type': 'application/json'
            }
        })
        .then(handleHttpErrors)
        .then(() => groceryList.splice(index, 1));
    };
}

List.export(exports);

