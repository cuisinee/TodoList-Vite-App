import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import TodoItem from '@components/TodoItem';
import { fetchAllTodos } from '@/reducers/todoSlice';
//import { fetchAllTodos } from '@/actions'

class TodoItemList extends Component {
    /*
        true(myTodos 변수에 변동이 있으면) 이면 render() 함수가 호출됨
        false(myTodos 변수에 변동이 없으면) 이면 render() 함수가 호출되지 않음 (렌더링 생략)
    */
    shouldComponentUpdate(nextProps) {
        //로딩 상태(status)와 에러(error)가 바뀔 때도 리렌더되어야 로딩/에러 UI가 표시된다
        return (
            this.props.myTodos !== nextProps.myTodos ||
            this.props.status !== nextProps.status ||
            this.props.error !== nextProps.error
        );
    }
    //HTML DOM 렌더링 후에 호출되는 lifecyle method
    componentDidMount() {
        this.props.fetchAll();
    }

    render() {
        const { myTodos, status, error } = this.props;

        //로딩 중일 때
        if (status === 'loading') {
            return <div className="todo-status">불러오는 중...</div>;
        }

        //로딩 실패 시 에러 메시지 표시
        if (status === 'failed') {
            return <div className="todo-status todo-error">에러가 발생했습니다: {error}</div>;
        }

        const todoList = myTodos.map(
            ({ id, text, checked }) => (
                <TodoItem
                    id={id}
                    text={text}
                    checked={checked}
                    key={id}
                />
            )
        );
        return (
            <div>
                {todoList}
            </div>
        );
    }
}

TodoItemList.propTypes = {
    myTodos: PropTypes.array,
    status: PropTypes.string,
    error: PropTypes.string,
    fetchAll : PropTypes.func
};

export default connect(
    //store에 저장된 state 객체의 todos, status, error 를 컴포넌트 props 로 매핑
    (state) => ({
        myTodos: state.todos,
        status: state.status,
        error: state.error,
    }),
    //action함수를 dispatch 하는 함수를 fetchAll 이름에 매핑
    { fetchAll: fetchAllTodos }
)(TodoItemList);