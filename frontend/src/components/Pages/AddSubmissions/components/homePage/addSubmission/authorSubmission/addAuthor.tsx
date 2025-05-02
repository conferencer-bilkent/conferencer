import { useSubmissionContext } from "../../../../../../../context/addSubmissionContext";
import { Person } from "../../../../../../../reducer/initailState";
import { countries } from "../../../../../../../utils/countries/countries";
import { useUser } from "../../../../../../../context/UserContext";
import "./addAuthor.css";

interface AuthorProps {
  person: Person;
  index: number;
}

const AddAuthor: React.FC<AuthorProps> = ({ person, index }) => {
  const { handleInput, authorIndex, state, showValidation } =
    useSubmissionContext();
  const { user } = useUser();

  const getInputStyle = (value: string | boolean) => {
    if (!showValidation) return {};

    return {
      borderColor: !value ? "#ff0000" : undefined,
      borderStyle: !value ? "solid" : undefined,
      borderWidth: !value ? "1px" : undefined,
    };
  };

  const handleFillAsYourself = () => {
    if (user) {
      handleInput(
        {
          target: { value: user.name },
        } as React.ChangeEvent<HTMLInputElement>,
        "firstName",
        index
      );

      handleInput(
        {
          target: { value: user.surname },
        } as React.ChangeEvent<HTMLInputElement>,
        "lastName",
        index
      );

      handleInput(
        {
          target: { value: user.email },
        } as React.ChangeEvent<HTMLInputElement>,
        "email",
        index
      );

      if (user.organization) {
        handleInput(
          {
            target: { value: user.organization },
          } as React.ChangeEvent<HTMLInputElement>,
          "organization",
          index
        );
      }

      if (user.country) {
        handleInput(
          {
            target: { value: user.country },
          } as React.ChangeEvent<HTMLInputElement>,
          "selectedCountry",
          index
        );
      }
    }
  };

  return (
    <div>
      <div
        className="authorPartContainer"
        style={{
          display: index === authorIndex ? "block" : "none",
        }}
      >
        <div className="authorTitle">
          <p>Author {index + 1}</p>
          <button className="fillAsYourself" onClick={handleFillAsYourself}>
            fill as yourself
          </button>
        </div>
        <label className="authorLabel">
          <p>First Name: *</p>
          <input
            value={person.firstName}
            type="text"
            onChange={(e) => handleInput(e, "firstName", index)}
            style={getInputStyle(person.firstName)}
          />
        </label>
        <label className="authorLabel">
          <p>Last Name: *</p>
          <input
            value={person.lastName}
            onChange={(e) => handleInput(e, "lastName", index)}
            style={getInputStyle(person.lastName)}
          />
        </label>
        <label className="authorLabel">
          <p>Email: *</p>
          <input
            type="email"
            value={person.email}
            onChange={(e) => handleInput(e, "email", index)}
            style={getInputStyle(person.email)}
          />
        </label>
        <label className="authorLabel">
          <p>Country: *</p>
          <select
            value={person.selectedCountry}
            onChange={(e) => handleInput(e, "selectedCountry", index)}
            style={getInputStyle(person.selectedCountry)}
          >
            <option value="">Select a country</option>
            {countries.map((country: string, i: number) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <label className="authorLabel">
          <p>Organization: *</p>
          <input
            value={person.organization}
            onChange={(e) => handleInput(e, "organization", index)}
            style={getInputStyle(person.organization)}
          />
        </label>
      </div>
      <label
        style={{
          alignItems: "center",
          marginTop: "10px",
          display: index === authorIndex ? "block" : "none",
        }}
      >
        Email notification
        <input
          type="checkbox"
          style={{ marginLeft: "10px" }}
          checked={person.emailNotification}
          onChange={(e) => {
            handleInput(e, "emailNotification", index);
          }}
        ></input>
      </label>

      {index === authorIndex && index > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "rgb(161, 166, 164)",
            borderRadius: "4px",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Previous Authors:</h4>
          {Array.from({ length: index }).map((_, prevIndex) => (
            <div
              key={prevIndex}
              style={{
                marginBottom: "8px",
                padding: "8px",
                backgroundColor: "white",
                borderRadius: "4px",
              }}
            >
              <p>
                <strong>Author {prevIndex + 1}:</strong>
              </p>
              <p>
                Name: {state.persons[prevIndex].firstName}{" "}
                {state.persons[prevIndex].lastName}
              </p>
              <p>Email: {state.persons[prevIndex].email}</p>
              <p>Organization: {state.persons[prevIndex].organization}</p>
              <p>Country: {state.persons[prevIndex].selectedCountry}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddAuthor;
