import React from 'react';
import './dynamicSubmissions.css';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DeleteSweepTwoToneIcon from '@mui/icons-material/DeleteSweepTwoTone';
import TurnSharpRightOutlinedIcon from '@mui/icons-material/TurnSharpRightOutlined';

type SubmissionsProps = {
    submissions: Array<{
        [key: string]: {
            [key: string]: string;
        }
    }>;
    isCurrent: boolean;
};

const DynamicSubmissionsPage: React.FC<SubmissionsProps> = ({ submissions, isCurrent }: SubmissionsProps) => {
    return (
        <div className='currentSubmissions'>
            <h3 className="titleCurrent">{ isCurrent ? "Current Submissions" : "Deleted Submissions" }</h3>
            <div className="tableContainer">
                <table>
                    <thead>
                        <tr>
                            {Object.keys(Object.values(submissions[0])[0]).map((key, index) => 
                                (<td key={index}>{key}</td>))}
                            {isCurrent && (
                                <>
                                    <td>Edit Paper</td>
                                    <td>Delete Paper</td>
                                    <td>Change Track</td>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(submissions[0]).map((item, index) => (
                            <tr key={index}>
                                {Object.values(item).map((element, index) => (
                                    <td key={index}>{element}</td>
                                ))}
                                {isCurrent && (
                                    <>
                                        <td><CreateTwoToneIcon /></td>
                                        <td><DeleteSweepTwoToneIcon /></td>
                                        <td><TurnSharpRightOutlinedIcon /></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>           
        </div>
    );
};

export default DynamicSubmissionsPage;