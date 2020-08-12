import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import useInput from "Hooks/useInput";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import { CONFIRM_SECRET, CREATE_ACCOUNT, REQUEST_SECRET } from "./AuthGQL";
import { useDispatch } from "react-redux";
import {
  logIn as actionLogin,
  logUserSave as acionLogUserSave,
} from "_actions/log_actions";

import AuthPresenter from "./AuthPresenter";

function Auth(props) {
  const dispatch = useDispatch();
  const actionType = { login: "login", signUp: "signUp", confirm: "confirm" };
  const [action, setAction] = useState(actionType.login);
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({
      email: Yup.string().email("email 형식 틀림").required("required"),
      name: Yup.string(),
      firstName: Yup.string(),
      lastName: Yup.string(),
      bio: Yup.string(),
      secret: Yup.string(),
    })
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
      secret: "",
    },
    onSubmit: async (data, { setSubmitting }) => {
      setSubmitting(true);
      console.log(data, action);
      if (action === actionType.login) {
        await handleLoginTo(data);
      }
      if (action === actionType.confirm) {
        await handleConfirmTo(data);
      }
      if (action === actionType.signUp) {
        await handleSignUpTo(data);
      }
      setSubmitting(false);
    },
    validationSchema,
  });

  const [requestSecret] = useMutation(REQUEST_SECRET);
  const [confirmSecret] = useMutation(CONFIRM_SECRET);
  const [createAccount] = useMutation(CREATE_ACCOUNT);

  const ActionChangeLogin = () => {
    setAction(actionType.login);
    setValidationSchema(
      Yup.object().shape({
        email: Yup.string().email("email 형식 틀림").required("required"),
      })
    );
  };
  const ActionChangeSignUp = () => {
    setAction(actionType.signUp);
    setValidationSchema(
      Yup.object().shape({
        email: Yup.string().email("email 형식 틀림").required("required"),
        name: Yup.string().required("required"),
        firstName: Yup.string(),
        lastName: Yup.string(),
        bio: Yup.string(),
      })
    );
  };
  const ActionChangeConfirm = () => {
    setAction(actionType.confirm);
    setValidationSchema(
      Yup.object().shape({
        secret: Yup.string().required("required"),
      })
    );
  };

  const handleLoginTo = async (data) => {
    const { email } = data;
    if (email === "") {
      toast.error("이메일을 입력해 주세요.");
      return;
    }
    try {
      await requestSecret({
        variables: {
          email: email.trim(),
        },
      });
      toast.success("이메일의 인증번호를 입력해 주세요.");
      setAction(actionType.confirm);
    } catch (error) {
      console.log(error);
      toast.error("해당 이메일이 없습니다.");
    }
  };

  const handleConfirmTo = async (data) => {
    const { secret, email } = data;
    // toast.success("handleConfirmToHome");
    try {
      const {
        data: { confirmSecret: confirmSecretResult },
      } = await confirmSecret({
        variables: {
          secret: secret.trim(),
          email: email.trim(),
        },
      });
      dispatch(actionLogin(confirmSecretResult));
      dispatch(acionLogUserSave(confirmSecretResult));
      toast.success("로그인 성공 환영합니다!");
      props.history.push("/");
    } catch (error) {
      console.log(error);
      toast.error("로그인 비밀번호를 다시 확인해 주세요.");
    }
  };
  //confirm

  const handleSignUpTo = async (data) => {
    const { name, email, firstName, lastName, bio } = data;
  };

  return (
    <AuthPresenter
      actionType={actionType}
      action={action}
      formik={formik}
      ActionChangeLogin={ActionChangeLogin}
      ActionChangeSignUp={ActionChangeSignUp}
      ActionChangeConfirm={ActionChangeConfirm}
    />
  );
}

export default Auth;
