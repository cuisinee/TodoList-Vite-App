import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '@components/Form.css';
//import { addTodo } from '@/actions';
import { addTodo } from '@/reducers/todoSlice';

class Form extends Component {
    state = {
        todo: ''
    };

    handleChange = (e) => {
        this.setState({
            todo: e.target.value // input field의 다음 바뀔 값
        });
    }

    handleCreate = () => {
        const { todo } = this.state;
        const newTodo = {
            text: todo,
            checked: false
        };
        this.props.add(newTodo);

        this.setState({ todo: ''});
    }

    handleEnter = (e) => {
        // 눌려진 키가 Enter Key 이면 handleCreate 호출
        if (e.keyCode === 13) {
            this.handleCreate();
        }
    };

    render() {
        const { todo } = this.state;
        const { handleChange, handleCreate, handleEnter } = this;

        return (
            <div className="form">
                <input value={todo} onChange={handleChange}
                    onKeyDown={handleEnter} />
                <div className="create-button" onClick={handleCreate}>
                    추가
                </div>
            </div>
        );
    }
}

Form.propTypes = {
    add: PropTypes.func
};

export default connect(null, { add: addTodo })(Form);