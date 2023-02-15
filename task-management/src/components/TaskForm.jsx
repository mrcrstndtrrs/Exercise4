import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import Joi from "joi";
import React, { useState } from "react";

const TaskForm = ({ onSubmit, initialValue }) => {
  const [form, setForm] = useState(
    initialValue || {
      title: "",
    }
  );

  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    title: Joi.string().min(3).required(),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const handleChange = ({ currentTarget: input }) => {
    setForm({
      ...form,
      [input.name]: input.value,
    });

    const { error } = schema
      .extract(input.name)
      .label(input.name)
      .validate(input.value);

    if (error) {
      setErrors({ ...errors, [input.name]: error.details[0].message });
    } else {
      delete errors[input.name];
      setErrors(errors);
    }
  };

  const isFormInvalid = () => {
    const result = schema.validate(form);

    return !!result.error;
  };

  return (
    <Grid
      container
      component="form"
      justifyContent="center"
      onSubmit={handleSubmit}
    >
      <Grid item xs={6}>
        <Card>
          <CardHeader title={`${initialValue ? "Edit" : "Add"} Task`} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  error={!!errors.title}
                  helperText={errors.title}
                  onChange={handleChange}
                  value={form.title}
                  label="Title"
                  variant="standard"
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button disabled={isFormInvalid()} type="submit" fullWidth>
              Submit
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TaskForm;
