import Component from 'nativescript-component';

class ListItem extends Component {

    delete() {
        // Get the function that the parent component provided for deleting an item.
        let deleteItem = this.get('deleteItem'),
            item = this.bindingContext;

        return deleteItem(item);
    }
}

ListItem.export(exports);
