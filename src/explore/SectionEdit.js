import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';

class SectionEdit extends Component {
  emptyItem = {
      school:"",
      section:"",
      grade:"",
      sectionName:"",
      gradeName:"",
      schoolName:""
  };

  state = {
    selectedSchool:null,
    selectedGrade:null,
    selectedSection:null,
    sectionName:"",
    gradeName:"",
    schoolName:""
  }

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      schools : [],
      grades : [],
      sections : [],
      selectedItems: [],
      sectionName:"",
      gradeName:"",
      schoolName:""
    };
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    // alert('GroupID = '+this.props.match.params.id);
     if (this.props.match.params.id !== 'new') {
       const section = await (await fetch(`http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080/api/v1/group/${this.props.match.params.id}`)).json();
       console.log(section);
       this.setState(
         {item: section,
           sectionName:section.label,
           schoolName: section.schoolId,
           gradeName: section.classId
         });
     } else {
       return axios.get(`http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080/api/v1/school/`)
       .then(result => {
         console.log(result);
         this.setState({
           schools: result.data, error:false});
         }).catch(error => {
         console.error("error", error);
         this.setState({
           error:`${error}`
         });
       });
     }
   }
 
   handleSchoolChange = (selectedSchool) => {
     const selectedSchoolName = selectedSchool.name;
     this.setState({selectedSchoolName });
     return axios.get(`http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080/api/v1/class/school/`+selectedSchool.id)
       .then(result => {
         console.log(result);
         this.setState({
           grades: result.data, error:false});
         }).catch(error => {
         console.error("error", error);
         this.setState({
           error:`${error}`
         });
       });
   }
   handleClassChange = (selectedGrade) => {
     const selectedGradeValue = selectedGrade.name;
     this.setState({selectedGradeValue });
     return axios.get(`http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080/api/v1/section/class/`+selectedGrade.id)
       .then(result => {
         console.log(result);
         this.setState({
           sections: result.data, error:false});
         }).catch(error => {
         console.error("error", error);
         this.setState({
           error:`${error}`
         });
       });
   }
 
   handleEditChange = (e) => {
     this.setState({
         [e.target.name]: e.target.value,
     });
   }
 
  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  async handleSubmit(event) {
    //event.preventDefault();
    const {item, selectedSchool, selectedGrade, 
      selectedSection} = this.state;
    //alert(selectedItems.length);   
  //   alert('School = '+selectedSchool.label);
  //  alert('Grade = '+selectedGrade.label);
  //   alert('Section = '+selectedSection.label);
  //   alert('Group = '+groupName);
    
    await fetch('/api/section', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/sections');
  }

  render() {
    const {item, selectedSchool, selectedGrade, 
      selectedSection, schools, 
      grades, sectionName, schoolName, gradeName} = this.state;
    //const title = <h2>{item.id ? 'Edit Section' : 'Add Section'}</h2>;
    if (this.props.match.params.id !== 'new') {
        return <div className="app">
        <Container>
            <h2>Edit Section</h2>
            <Form onSubmit={this.handleSubmit}>
            <div className="row">
            <FormGroup className="col-md-3 mb-3">
                <Label for="name">School Name</Label>
                <Input type="text" ref="schoolName" name="schoolName" id="schoolName" value={schoolName}/>
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
                <Label for="grade">Class or Grade</Label>
                <Input type="text" ref="gradeName" name="gradeName" id="gradeName" value={gradeName}/>
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
                <Label for="sectionName">Section</Label>
                <Input type="text" ref="sectionName" name="sectionName" id="sectionName" placeholder="Enter Section Name" onChange={e => this.onChange(e)}  value={sectionName}/>
            </FormGroup>
                </div>
            <FormGroup>   
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="success" tag={Link} to="/sections">Cancel</Button>
            </FormGroup>
            </Form>
        </Container>
        </div>
    } else{
        return <div className="app">
        <Container>
            <h2>Add Section</h2>
            <Form onSubmit={this.handleSubmit}>
            <div className="row">
            <FormGroup className="col-md-3 mb-3">
                <Label for="name">School Name</Label>
                <Select options={ schools } name="school" id="school" onChange={this.handleSchoolChange} value={selectedSchool}
                        />
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
                <Label for="grade">Class or Grade</Label>
                <Select options={ grades } name="grade" id="grade" onChange={this.handleClassChange} value={selectedGrade}
                        />
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
                <Label for="sectionName">Section</Label>
                <Input type="text" ref="sectionName" name="sectionName" id="sectionName" placeholder="Enter Section Name" onChange={e => this.onChange(e)}  value={sectionName}/>
            </FormGroup>
                </div>
            <FormGroup>   
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="success" tag={Link} to="/sections">Cancel</Button>
            </FormGroup>
            </Form>
        </Container>
        </div>
    }
  }
}
export default SectionEdit;