import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/atoms/Input";
import { StyledEditTitleDialog } from "./style.js";
import { StyledAlignFlex,StyledBetweenAlignFlex } from "@/style/common";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SidebarControlProfile from "@/components/atoms/SidebarControlProfile";
import {
  StyledDialog,
  dialogStyle,
} from "@/components/organism/Dialog/style.js";
import { Button,Dialog,DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface titleProps {
  title: string;
}

export const formSchema = Yup.object({
  title: Yup.string().required("This field is required."),
});

const EditTitleDialog = () => {
  const [open,setOpen] = useState(false);
  const [title,setTitle] = useState<string>("")
  const [titleFinal,setTitleFinal] = useState<string>("Front-End Developer")
  const openToggle = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<titleProps>({
    resolver: yupResolver(formSchema),
  });
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setTitle(title);
    // openToggle();
  }
  const handleSaveTitle = () => {
    if (title.length > 5) {
      setTitleFinal(title);
      openToggle();
    }
  }
  const onSubmit = async (data: titleProps) => {
    // // login(data);
    // console.log("asfadfadf");
    // reset();
  };

  return (
    <div>
      <SidebarControlProfile
        text={titleFinal}
        editIcon
        onEditClicked={() => openToggle()}
      />

      <Dialog open={open} PaperProps={{ style: dialogStyle }}>
        <StyledBetweenAlignFlex margin="0 0 3rem">
          <h2>Edit your title</h2>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            fontSize="medium"
            onClick={openToggle}
          />
        </StyledBetweenAlignFlex>
        <StyledEditTitleDialog>
          <div className="text">
            <h4>Your title</h4>
            <p>
              Enter a single sentence description of your professional
              skills/experience (e.g. Expert Web Designer with Ajax experience)
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              placeholder="Example: Web Application Developer"
              defaultValue={titleFinal}
              name="title"
              imageHidden
              onChange={handleChangeTitle}
            // register={register}
            />
            {errors.title && (
              <StyledAlignFlex gap="8px" margin="5px 0 0 0">
                <ErrorOutlineIcon
                  sx={{ color: "var(--danger-color)",fontSize: 16 }}
                />
                <p className="error">{errors.title.message}</p>
              </StyledAlignFlex>
            )}
          </form>
        </StyledEditTitleDialog>
        <StyledDialog>
          <DialogActions>
            <StyledAlignFlex gap="10px" margin="25px 0 0">
              <Button onClick={() => openToggle()} variant="contained">
                Cancel
              </Button>
              <Button onClick={handleSaveTitle} variant="contained">
                Save
              </Button>
            </StyledAlignFlex>
          </DialogActions>
        </StyledDialog>
      </Dialog>
    </div>
  );
};

export default EditTitleDialog;
