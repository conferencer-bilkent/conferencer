import { useSubmissionContext } from '../../../../../../../context/addSubmissionContext';
import { Person } from '../../../../../../../reducer/initailState';
import { countries } from '../../../../../../../utils/countries/countries';
import './addAuthor.css';

interface   AuthorProps {
    person: Person,
    index: number,
}

const AddAuthor: React.FC<AuthorProps> = ({person, index}) => {
    const {handleInput, authorIndex} = useSubmissionContext();

  return (
    <div>
        <div 
            key={index} 
            className="authorPartContainer"
            style={{display: index === authorIndex ? "block": "none"}}
        >
        <div className="authorTitle">
            <p>Author {index + 1}</p>
            <button
                className='fillAsYourself'
                >fill as yourself
            </button>
            <button
                className='fillAsYourself'
                >fill as associate
            </button>
        </div>
        <label className='authorLabel'>
            <p>First Name:</p>
            <input 
                value= {person.firstName}
                type='text'
                onChange={(e) => handleInput(e, "firstName", index)}
            />
        </label>
        <label className='authorLabel'>
            <p>Last Name:</p>
            <input 
                value={person.lastName}
                onChange={(e) => handleInput(e, "lastName", index)}
            />
        </label>
        <label className='authorLabel'>
            <p>Email:</p>
            <input 
                type='email'
                value={person.email}
                onChange={(e) => handleInput(e, "email", index)}
            />
        </label>
        <label className='authorLabel'>
            <p>Country:</p>
            <select 
                value={person.selectedCountry}
                onChange={(e) => handleInput(e, "selectedCountry", index)}
            >
                {countries.map((country: string, i: number) => (
                    <option key={i} value={country}>
                        {country}
                    </option>
                ))}
            </select>
        </label>
        <label className='authorLabel'>
            <p>Organization:</p>
            <input 
                value={person.organization}
                onChange={(e) => handleInput(e, "organization", index)}
            />
        </label>
    </div>
    <label 
        style={{
            alignItems:'center',
            marginTop:'10px',
            display: index === authorIndex ? "block": "none"}}>
             Email notification
        <input 
            type="checkbox" 
            style={{marginLeft:'10px'}}
            checked={person.emailNotification}
            onChange={(e) => {handleInput(e, "emailNotification", index)}}
            ></input>
    </label>
    </div>
  )
}

export default AddAuthor