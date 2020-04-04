import React,{Component} from 'react';
import axios from 'axios';
import {Navbar, Container, Form, Row, Col, Button, Table} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      dataApi:[],
      edit:false,
      dataPost:{
        id:0,
        nama_karyawan:'',
        jabatan:'',
        jenis_kelamin:'',
        tanggal_lahir:'',
      }
    };
    this.handleRemove=this.handleRemove.bind(this);
    this.inputChange=this.inputChange.bind(this);
    this.onSubmitForm=this.onSubmitForm.bind(this);
  }

  reloadData(){
    axios.get('http://localhost:3005/data-karyawan').then(
      res=>{
        this.setState({
          dataApi:res.data,
          edit:false
        })
      }
    )
  }

  componentDidMount(){
    this.reloadData()
  }

  handleRemove(e){
    console.log(e.target.value)
    axios.delete(`http://localhost:3005/data-karyawan/${e.target.value}`).then(res=>this.reloadData())
    // fetch(`http://localhost:3005/data-karyawan/${e.target.value}`,{method:"DELETE"}).then(res=>console.log(res))
  }

  inputChange(e){
    let newdataPost={...this.state.dataPost}
    if(this.state.edit===false){
      newdataPost['id'] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;

    this.setState(
      {
        dataPost: newdataPost
      },
      ()=>console.log(this.state.dataPost)
    )
  }

  onSubmitForm(){
    if(this.state.edit===false){
      axios
        .post(`http://localhost:3005/data-karyawan/`,this.state.dataPost)
        .then(()=>{
          this.reloadData()
          this.clearData();
        })
    }else{
      axios
        .put(`http://localhost:3005/data-karyawan/${this.state.dataPost.id}`,this.state.dataPost)
        .then(()=>{
          this.reloadData()
          this.clearData();
        })
    }
  }

  getDataId=(e)=>{
    axios
      .get(`http://localhost:3005/data-karyawan/${e.target.value}`)
      .then((res)=>{
        this.setState({
          dataPost:res.data,
          edit:true
        });
      });
  }

  clearData = ()=>{
    let newdataPost={...this.state.dataPost};
    newdataPost["id"]="";
    newdataPost["nama_karyawan"]="";
    newdataPost["jabatan"]="";
    newdataPost["jenis_kelamin"]="";
    newdataPost["tanggal_lahir"]="";
    this.setState({
      dataPost : newdataPost
    });
  }

  refreshPage=()=>{
    window.location.reload();
  }

  render(){
    return(
      <div>
        <Navbar bg='primary' variant='dark'>
          <Navbar.Brand href='#home'>HR Apllication</Navbar.Brand>
        </Navbar>
        <br/><br/>
        <Container>
          <Row>
            <Col>
              <h1>DATA KARYAWAN</h1>
            </Col>
            <Col className="text-right">
              <Button variant="primary" onClick={this.refreshPage}><Icon.ArrowCounterclockwise/></Button>
            </Col>
          </Row>
          <br/>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Nama</Form.Label>
                <Form.Control
                  type="text"
                  name="nama_karyawan"
                  value={this.state.dataPost.nama_karyawan}
                  placeholder="Nama"
                  onChange={this.inputChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Jabatan</Form.Label>
                <Form.Control
                  type="text"
                  name="jabatan"
                  value={this.state.dataPost.jabatan}
                  placeholder="Jabatan"
                  onChange={this.inputChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Jenis Kelamin</Form.Label>
                <Form.Control as="select" name="jenis_kelamin" value={this.state.dataPost.jenis_kelamin} onChange={this.inputChange}>
                  <option value="Pilih Jenis Kelamin" hidden>Pilih Jenis Kelamin</option>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control type="date" name="tanggal_lahir" value={this.state.dataPost.tanggal_lahir} onChange={this.inputChange}/>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Button variant="primary" size="sm" block type="submit" onClick={this.onSubmitForm}>
                Simpan
              </Button>
            </Form.Row>
          </Form>
          <br/><br/>
          <Table responsive>
            <thead>
              <tr className="text-center">
                <th>No.</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Jenis Kelamin</th>
                <th>Tanggal Lahir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataApi.map((dat,index)=>{
                return(
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{dat.nama_karyawan}</td>
                    <td>{dat.jabatan}</td>
                    <td>{dat.jenis_kelamin}</td>
                    <td className="text-center">{dat.tanggal_lahir}</td>
                    <td className="text-center">
                      <Button value={dat.id} variant="success"  onClick={this.getDataId}>
                        <Icon.Pencil/>
                      </Button>{' '}
                      <Button value={dat.id} variant="danger"  onClick={this.handleRemove}>
                        <Icon.Trash/>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    )
  }
}

export default App;
