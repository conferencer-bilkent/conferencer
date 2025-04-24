import { useSubmissionContext } from '../../../../../../../context/addSubmissionContext';
import './submissonTexts.css';
useSubmissionContext

const SubmissionTextsPage: React.FC = () => {
    const { handleInput } = useSubmissionContext();   

    return (
        <div className="subbmssionsDetailTable" >
            <div className="titleContainer" >
                <label>Title:</label>
                <input
                    onChange={(e) => {handleInput(e, "title")}}
                />
            </div>
            <div className="titleContainer" >
                <label>Abstract:</label>
                <textarea
                    rows={5}
                    onChange={(e) => {handleInput(e, "abstract")}}
                />
            </div>
            <div className="titleContainer" >
                <label>Keywords:</label>
                <textarea
                    rows={3}
                    onChange={(e) => {handleInput(e, "keywords")}}
                />
            </div>
        </div>
    );
};

export default SubmissionTextsPage;


