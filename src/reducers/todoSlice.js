import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

//Action 과 Reducer를 합친 개념이 Slice 이다.
const BASE_URL = import.meta.env.VITE_API_URL;
const apiUrl = `${BASE_URL}/todos`;

//Action 시작
export const fetchAllTodos = createAsyncThunk(
    //action 이름
    "load/todos", 
    async () => {
        const response = await axios.get(apiUrl);
        return response.data;
    }
);

export const removeTodo = createAsyncThunk(
    "remove/todo",
    async (id) => {
        const response = await axios.delete(`${apiUrl}/${id}`);
        return response.data;
    }
);

export const toggleTodo = createAsyncThunk(
    "toggle/todo",
    async (todo) => {
        const response = await axios.patch(`${apiUrl}/${todo.id}`, todo);
        return response.data;
    }
);

export const addTodo = createAsyncThunk(
    "add/todo",
    async (todo) => {
        const response = await axios.post(apiUrl, todo);
        return response.data;
    }
);
//Action 끝

//Reducer 시작
const initialState = {
    todos: [
        {
            id: 0,
            text: '',
            checked: false,
        }
    ],
    //fetchAllTodos의 진행 상태: 'idle' | 'loading' | 'succeeded' | 'failed'
    status: 'idle',
    //실패 시 에러 메시지 (성공 시 null)
    error: null,
};

/*
createSlice 는 아래 내용을 반환한다.
{
    name : string,
    reducer : ReducerFunction,
    actions : Record<string, ActionCreator>,
    caseReducers: Record<string, CaseReducer>.
    getInitialState: () => State
}
*/
const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    // extraReducer에 비동기 함수의 pending, fulfilled, rejected를 처리할 내용을 넣어준다!
    extraReducers:(builder) => {
        builder
            //로딩 시작: 요청 진행 중 상태로 전환하고 이전 에러를 초기화
            .addCase(fetchAllTodos.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllTodos.fulfilled , (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.todos = action.payload;
            })
            //로딩 실패: 에러 메시지를 보관하여 UI에 표시
            .addCase(fetchAllTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(removeTodo.fulfilled, (state, action) => {
                state.todos = action.payload;
            })
            .addCase(toggleTodo.fulfilled, (state, action) => {
                state.todos = action.payload;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos = action.payload;
            });
    }
});

export default todosSlice.reducer;