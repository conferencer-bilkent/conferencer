import DynamicSubmissionsPage from '../dynamicSubmissions/dynamicSubmissionsPage';
import './submissionsList.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AppButton from '../../../../../global/AppButton';
import { currentSubmissionsArray } from '../../../../../../utils/dummyData/currentSubmissionData';
import { deletedSubmissionsArray } from '../../../../../../utils/dummyData/deletedSubmissions';
import { useNavigate } from 'react-router-dom';

const SubmissionsList = () => {
  const navigate = useNavigate();

  const handleAddSubmission = () => {
    navigate("/addSubmission");
  };
  
  return (
    <div className='SubmissionsList'>
      <AppButton 
        icon={<AddCircleOutlineIcon />} 
        text={'Add Submission'} 
        onClick={handleAddSubmission} />
      <DynamicSubmissionsPage submissions={currentSubmissionsArray} isCurrent={true} />
      <DynamicSubmissionsPage submissions={deletedSubmissionsArray} isCurrent={false} />
    </div>
  )
}

export default SubmissionsList