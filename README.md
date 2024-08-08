Folder Structure:

src/
├── components/
│   ├── FormGenerator.tsx
│   ├── FormField.tsx
│   └── fields/
│       ├── CheckboxField.tsx
│       ├── RadioField.tsx
│       ├── SelectField.tsx
│       ├── TextAreaField.tsx
│       └── TextField.tsx
├── hooks/
│   └── useFormSubmit.ts
├── utils/
│   └── validationSchema.ts
├── App.tsx
├── index.tsx
└── types/
    └── formTypes.ts

Code Implementation:

src/types/formTypes.ts
----------------------
import * as Yup from 'yup';

export interface Field {
  type: string;
  name: string;
  label?: string;
  value?: string;
  options?: string[];
  validation?: Yup.AnySchema;
}

export interface FormGeneratorProps {
  jsonData: {
    fields: Field[];
  };
  onSubmit: (values: any) => Promise<void>;
}

src/utils/validationSchema.ts
-----------------------------
import * as Yup from 'yup';
import { Field } from '../types/formTypes';

export const generateValidationSchema = (fields: Field[]) => {
  const shape: any = {};
  fields.forEach(field => {
    if (field.validation) {
      shape[field.name] = field.validation;
    }
  });
  return Yup.object().shape(shape);
};

src/hooks/useFormSubmit.ts
--------------------------
import { useState } from 'react';

export const useFormSubmit = (onSubmit: (values: any) => Promise<void>) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      await onSubmit(values);
      setSuccessMessage('Form submitted successfully!');
      setErrorMessage(null);
      resetForm(); // Reset form fields to initial values
    } catch (error) {
      setErrorMessage('Failed to submit the form. Please try again.');
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, successMessage, errorMessage };
};

src/components/fields/CheckboxField.tsx
---------------------------------------
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormControlLabel, Checkbox } from '@material-ui/core';

interface CheckboxFieldProps {
  name: string;
  label?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label }) => (
  <div>
    <FormControlLabel
      control={<Field name={name} type="checkbox" as={Checkbox} />}
      label={label}
    />
    <ErrorMessage name={name} component="div" />
  </div>
);

export default CheckboxField;

src/components/fields/RadioField.tsx
------------------------------------
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

interface RadioFieldProps {
  name: string;
  label?: string;
  options: string[];
}

const RadioField: React.FC<RadioFieldProps> = ({ name, label, options }) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
    <Field name={name} as={RadioGroup}>
      {options.map((option, idx) => (
        <FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
      ))}
    </Field>
    <ErrorMessage name={name} component="div" />
  </FormControl>
);

export default RadioField;

src/components/fields/SelectField.tsx
-------------------------------------
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormControl, FormLabel, Select, MenuItem } from '@material-ui/core';

interface SelectFieldProps {
  name: string;
  label?: string;
  options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({ name, label, options }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Field name={name} as={Select}>
      {options.map((option, idx) => (
        <MenuItem key={idx} value={option}>{option}</MenuItem>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" />
  </FormControl>
);

export default SelectField;

src/components/fields/TextAreaField.tsx
---------------------------------------
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormControl, FormLabel, TextareaAutosize } from '@material-ui/core';

interface TextAreaFieldProps {
  name: string;
  label?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, label }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Field name={name} as={TextareaAutosize} />
    <ErrorMessage name={name} component="div" />
  </FormControl>
);

export default TextAreaField;

src/components/fields/TextField.tsx
-----------------------------------
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField as MuiTextField } from '@material-ui/core';

interface TextFieldProps {
  name: string;
  label?: string;
  type?: string;
}

const TextField: React.FC<TextFieldProps> = ({ name, label, type = 'text' }) => (
  <div>
    <Field name={name} as={MuiTextField} label={label} type={type} />
    <ErrorMessage name={name} component="div" />
  </div>
);

export default TextField;

src/components/FormField.tsx
----------------------------
import React from 'react';
import { Field as FieldType } from '../types/formTypes';
import TextField from './fields/TextField';
import CheckboxField from './fields/CheckboxField';
import RadioField from './fields/RadioField';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';

interface FormFieldProps {
  field: FieldType;
  values: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, values, handleChange, handleBlur }) => {
  switch (field.type) {
    case 'text':
    case 'password':
    case 'email':
    case 'number':
      return <TextField name={field.name} label={field.label} type={field.type} />;
    case 'checkbox':
      return <CheckboxField name={field.name} label={field.label} />;
    case 'radio':
      return <RadioField name={field.name} label={field.label} options={field.options || []} />;
    case 'select':
      return <SelectField name={field.name} label={field.label} options={field.options || []} />;
    case 'textarea':
      return <TextAreaField name={field.name} label={field.label} />;
    default:
      return null;
  }
};

export default FormField;

src/components/FormGenerator.tsx
--------------------------------
import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@material-ui/core';
import { generateValidationSchema } from '../utils/validationSchema';
import FormField from './FormField';
import { FormGeneratorProps } from '../types/formTypes';
import { useFormSubmit } from '../hooks/useFormSubmit';

export const FormGenerator: React.FC<FormGeneratorProps> = ({ jsonData, onSubmit }) => {
  const { handleSubmit, successMessage, errorMessage } = useFormSubmit(onSubmit);

  const initialValues = jsonData.fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {} as any);

  const validationSchema = generateValidationSchema(jsonData.fields);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, values, isSubmitting, isValid, dirty }) => (
        <Form>
          {jsonData.fields.map((field, index) => (
            <FormField
              key={index}
              field={field}
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          ))}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
          >
            Submit
          </Button>
          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </Form>
      )}
    </Formik>
  );
};

src/App.tsx
-----------
import React from 'react';
import { FormGenerator } from './components/FormGenerator';
import * as Yup from 'yup';

const jsonData {
  fields: [
    { type: 'text', name: 'username', label: 'Username', validation: Yup.string().required('Please enter your username') },
    { type: 'password', name: 'password', label: 'Password', validation: Yup.string().required('Please enter your password') },
    { type: 'email', name: 'email', label: 'Email', validation: Yup.string().email('Please enter a valid email').required('Email is required') },
    { type: 'number', name: 'age', label: 'Age', validation: Yup.number().required('Age is required').min(0, 'Age must be a positive number') },
    { type: 'checkbox', name: 'subscribe', label: 'Subscribe to newsletter' },
    { type: 'radio', name: 'gender', label: 'Gender', options: ['Male', 'Female'], validation: Yup.string().required('Please select your gender') },
    { type: 'select', name: 'country', label: 'Country', options: ['USA', 'Canada', 'UK'], validation: Yup.string().required('Please select your country') },
    { type: 'textarea', name: 'bio', label: 'Bio' },
    { type: 'submit', value: 'Submit' }
  ]
};

const handleSubmit = async (values: any) => {
  // Simulate a form submission
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (values.username === 'error') {
        reject(new Error('Submission failed'));
      } else {
        resolve();
      }
    }, 1000);
  });
};

const App = () => {
  return <FormGenerator jsonData={jsonData} onSubmit={handleSubmit} />;
};

export default App;

src/index.tsx
-------------
import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(<App />, document.getElementById('root'));
