import './addSubmission.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddAuthor from './authorSubmission/addAuthor';
import SelectTrackPage from './selectTrack/selectTrackPage';
import SubmissionTextsPage from './submissionTexts/submissionTexts';
import AppButton from '../../../../../global/AppButton';
import { useSubmissionContext } from '../../../../../../context/addSubmissionContext';
import { Person } from '../../../../../../reducer/initailState';


const AddSubmissionPage: React.FC = () => {
    const {
        state,
        addPerson,
        handleFileChange,
        handleSendSubmission,
    } = useSubmissionContext();   

    return (
        <div className="submissionMainContainer">
            <div className="addSubmissionContainer">
                <div >
                    <h1 >Add Submission</h1>
                    <h3 style={{marginTop :"20px"}}>Select Track</h3>
                </div>
                <SelectTrackPage />               
                {state.persons.map((person: Person, index: number) => (
                    <AddAuthor person={person} index={index} />
                ))}
            <div className="addPersonContainer">
                <AppButton icon={<AddCircleOutlineIcon />} text={'Add Another Author'} onClick={addPerson}/>
            </div>
            </div>
            <div className="submissionDetailContainer">
                <SubmissionTextsPage />
                <div className='lastButtons'>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                    />
                    <AppButton 
                        icon={<AddCircleOutlineIcon />} 
                        text={'Send Submission'} 
                        onClick={handleSendSubmission}    
                    />   
                </div >
            </div>
        </div>
    );
};

export default AddSubmissionPage;


