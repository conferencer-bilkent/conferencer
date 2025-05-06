import { useSubmissionContext } from '../../../../../../../context/addSubmissionContext';
import { useTheme } from '@mui/material';
import { tokens } from '../../../../../../../theme';
import './submissonTexts.css';
import { Autocomplete, TextField } from "@mui/material";

const SubmissionTextsPage: React.FC = () => {
    const { handleInput, state, showValidation, allKeywords, selectedKeywords, setSelectedKeywords } = useSubmissionContext();   
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    return (
        <div
            style={{
                "--redAccent": colors.redAccent[500],
                "--background": colors.primary[500],
                "--greyBg": colors.grey[400],
                "--grey-border": colors.grey[100],
                "--textPrimary": theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            } as React.CSSProperties}
        >
            <div className="subbmssionsDetailTable">
                <div className="titleContainer">
                    <label>Title:</label>
                    <input onChange={(e) => handleInput(e, "title")} />
                </div>
                <div className="titleContainer">
                    <label>Abstract:</label>
                    <textarea
                        rows={5}
                        onChange={(e) => handleInput(e, "abstract")}
                    />
                </div>
                <div className="titleContainer keywordsContainer">
                    <label>Keywords:</label>
                    <Autocomplete
                        multiple
                        options={allKeywords}
                        value={selectedKeywords}
                        onChange={(_, newValue) => {
                            setSelectedKeywords(newValue);
                            handleInput(
                                { target: { value: newValue.join(", ") } } as React.ChangeEvent<HTMLInputElement>,
                                "keywords"
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={showValidation && !state.keywords}
                                helperText={showValidation && !state.keywords ? "Keywords are required" : ""}
                                variant="outlined"
                                fullWidth
                                sx={{ width: '480px' }}
                            />
                        )}
                        sx={{ width: '480px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubmissionTextsPage;


