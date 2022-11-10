import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearErrors } from "../../actions/userAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";
import {
  UPDATE_USER_RESET,
} from "../../constants/userConstants";

const NewUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, success, error } = useSelector((state) => state.addUser);

  const [avatar, setAvatar] = useState();
  const [role, setRole] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("preview.png");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const handleDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      enqueueSnackbar("Password length must be at least 8 characters", {
        variant: "warning",
      });
      return;
    }
    if (password !== cpassword) {
      enqueueSnackbar("Password doesn't match", { variant: "error" });
      return;
    }
    if (!avatar) {
      enqueueSnackbar("Select Avatar", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("gender", gender);
    formData.set("password", password);
    formData.set("role", role);
    formData.set("avatar", avatar);

    dispatch(addUser(formData));
  };

  

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Add New User Successfully", { variant: "success" });
      dispatch({ type: UPDATE_USER_RESET });
      navigate("/admin/users");
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Admin: New Product | Flipkart" />
      {loading && <BackdropLoader />}
      <form
        onSubmit={handleAddUser}
        encType="multipart/form-data"
        id="mainform"
        className="p-5 sm:p-10 bg-white rounded-lg"
      >
        <div className="flex flex-col gap-4 items-start">
          {/* <!-- input container column --> */}
          <div className="flex flex-col w-full justify-between sm:flex-col gap-3 items-center">
            <TextField
              fullWidth
              id="full-name"
              label="Full Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* <!-- input container column --> */}

          {/* <!-- gender input --> */}
          <div className="flex gap-4 items-center">
            <h2 className="text-md">Gender :</h2>
            <div className="flex items-center gap-6" id="radioInput">
              <RadioGroup
                row
                aria-labelledby="radio-buttons-group-label"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  name="gender"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                  control={<Radio required />}
                  label="Male"
                />
                <FormControlLabel
                  name="gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                  control={<Radio required />}
                  label="Female"
                />
              </RadioGroup>
            </div>
          </div>
          {/* <!-- gender input --> */}

          {/* <!-- input container column --> */}
          <div className="flex flex-col w-full justify-between sm:flex-col gap-3 items-center">
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              id="confirm-password"
              label="Confirm Password"
              type="password"
              name="cpassword"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
            />
            <TextField
              label="Role"
              select
              fullWidth
              variant="outlined"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value={"user"}>User</MenuItem>
              <MenuItem value={"admin"}>Admin</MenuItem>
            </TextField>
          </div>
          {/* <!-- input container column --> */}

          <div className="flex flex-col w-full justify-between sm:flex-row gap-3 items-center">
            <Avatar
              alt="Avatar Preview"
              src={avatarPreview}
              sx={{ width: 56, height: 56 }}
            />
            <label className="rounded font-medium bg-gray-400 text-center cursor-pointer text-white w-full py-2 px-2.5 shadow hover:shadow-lg">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleDataChange}
                className="hidden"
              />
              Choose File
            </label>
          </div>
          <button
            type="submit"
            className="text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium"
          >
            Add new user
          </button>
        </div>
      </form>
    </>
  );
};

export default NewUser;
