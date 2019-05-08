import React, {Component} from 'react';
import axios from 'axios';
import List from '../blocks/List'
import NewListForm from '../forms/NewListForm'
import EditListForm from '../forms/EditListForm'
import Pagination from '../blocks/Pagination'
import ReactPaginate from 'react-paginate'

class ListsContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lists: [],
      page_count: 1,
      current_page: 1,
      editingListId: null
    }
    this.addNewList  = this.addNewList.bind(this)
    this.removeList  = this.removeList.bind(this)
    this.editingList = this.editingList.bind(this)
    this.editList = this.editList.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.getData = this.getData.bind(this)
  }

  // Подтянуть данные
  componentDidMount() {
    this.getData(1)
  }

  getData(page) {
    axios.get('/api/v1/lists?page=' + page)
    .then(
      response => {
        console.log(response)
        this.setState({
          lists: response.data.items,
          page_count: response.data.count_page,
          current_page: response.data.current_page
        })
        console.log(this.state.lists)
      }
    )
    .catch(error => console.log(error))
  }

  // добавление задачи
  addNewList(title, excerpt) {
    axios.post('/api/v1/lists', { list: {title, excerpt} })
    .then(response => {
      console.log(this.state.lists.length)
      console.log(response)
      let lists = []
      console.log(this.state.current_page)
      if (this.state.lists.length<5) {
        console.log('add to ', lists)
        lists = [ ...this.state.lists, response.data ]
        console.log(lists)
      }
      else if (this.state.lists.length = 5 && this.state.current_page < this.state.page_count) {
        this.getData(this.state.current_page)
      } else {
        lists = this.state.lists
        this.getData(this.state.current_page + 1)
        // this.setState({ current_page: this.state.current_page + 1})
      }
      this.setState({lists})
    })
    .catch(error => {
      console.log(error)
    })
  }

  // удаление задачи
  removeList(id) {
    axios.delete('/api/v1/lists/' + id)
      .then(response => {
        const lists = this.state.lists.filter(
          list => list.id !== id
        )
        this.setState({ lists })
      })
      .catch(error => console.log(error))
  }

  // переключение на показ формы редактирования
  editingList(id) {
    this.setState({
      editingListId: id
    })
  }

  // редактирование
  editList(id, title, excerpt) {
      axios.put('/api/v1/lists/' + id, {
        list: {
          title,
          excerpt
        }
      })
      .then(response =>{
        console.log(response)
        const lists = this.state.lists
        let position = lists.find(x => x.id === id)
        let index = lists.indexOf(position)
        lists[index] = {id, title, excerpt}
        this.setState(() =>({
            lists,
            editingListId: null
        }))
      })
      .catch(error => console.log(error))
  }

  // закрыть форму редактирования
  closeEditForm(id) {
    this.editingList(null)
  }

  handlePageClick = data => {
    // console.log(data.selected + 1)
    this.getData(data.selected + 1)
  };

  render() {
    return(
      <div className="lists-container">
        {this.state.lists.map( list => {
            if ( this.state.editingListId === list.id ) {
                return (<EditListForm 
                        list={list} 
                        key={list.id} 
                        editList={this.editList} 
                        closeEditForm={this.closeEditForm} 
                        />)
            } else {
                return (<List 
                        list={list} 
                        key={list.id} 
                        onRemoveList={this.removeList} 
                        editingList={this.editingList} 
                        />)
            }
          })}
        <NewListForm onNewList={this.addNewList} />

        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.page_count}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          onPageChange={this.handlePageClick}
        />
      </div>
    )
  }

}
export default ListsContainer;