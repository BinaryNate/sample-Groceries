import Component from 'nativescript-component';

class ListItem extends Component {

    delete() {
        let deleteItem = this.get('deleteItem'),
            item = this.bindingContext;

        return deleteItem(item);
    }

}

ListItem.export(exports);
