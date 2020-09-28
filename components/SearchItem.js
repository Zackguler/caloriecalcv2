import React, {PureComponent} from 'react';

class SearchItem extends PureComponent {
    render() {
        return (
            <View>
                <Text>{this.props.val.name}</Text>
                <Text>{this.props.val.cal}</Text>
            </View>
        );
    }
}

export default SearchItem;
