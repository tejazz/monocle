import React from 'react';
import './searchTermBar.scss';

class SearchTermBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            inputTerm: '',
        };
    }

    componentDidMount = () => {
        // listen for 'enter' button to trigger an update
        this.keyPress.addEventListener('keydown', async (e) => {
            if (e.keyCode === 13) {
                this.props.resetStateSearchTerm(this.state.inputTerm);
                await this.setState({ inputTerm: ''});
                this.props.handlePowerToggleParent('search');
            }
        });
    }

    render() {
        return (
            <div className='SearchTermBar'>
                <input
                    type='text'
                    placeholder='Enter search term here (Press return to confirm)'
                    className='SearchTermBar__Input'
                    value={this.state.inputTerm}
                    onChange={(e) => this.setState({ inputTerm: e.target.value })}
                    ref={el => this.keyPress = el}
                />
            </div>
        );
    }
}

export default SearchTermBar;
