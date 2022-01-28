import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogTitle,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { useBoolean } from 'ahooks'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import './theme/index.ts'
import { emailRegex } from './util'

function Header() {
  return (
    <Container
      component="header"
      sx={{
        display: 'flex',
        height: 64,
        boxShadow: '0 2px 5px 1px rgb(64 60 67 / 16%)',
        alignItems: 'center',
      }}
    >
      <Typography component="h2" variant="h5">
        Broccoli &amp; Co.
      </Typography>
    </Container>
  )
}
const year = new Date().getFullYear()
function Footer() {
  return (
    <Typography color="text.secondary" align="center">
      Copyright ©{year}
      <Link href="#">Broccoli &amp; Co.</Link>
      All rights reserved.
    </Typography>
  )
}

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <Header />
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'auto',
          lineHeight: 1.2,
        }}
      >
        <h1 style={{ whiteSpace: 'break-spaces', textAlign: 'center' }}>
          {'A better way\nto enjoy every day.'}
        </h1>
        <Box component="sub" sx={{ color: 'text.secondary' }}>
          Be the first to know when we launch.
        </Box>
        <Invitation />
      </Container>
      <Footer />
    </Box>
  )
}

type FormValues = {
  name: string
  email: string
  confirm: string
}
function Invitation() {
  const [open, { setFalse, setTrue }] = useBoolean()
  const { handleSubmit, control, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      confirm: '',
    },
  })
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])
  const onSubmit = (data: FormValues) => {
    console.log(data)
  }
  return (
    <>
      <Dialog
        onClose={setFalse}
        open={open}
        aria-describedby="Request an invite"
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Request an invite
        </DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ p: 6, pt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{
                  validate: {
                    required(value) {
                      return !!value || 'Please input full name!'
                    },
                    maxLength(value) {
                      return value.length >= 3 || 'At least 3 characters!'
                    },
                  },
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextField
                      required
                      fullWidth
                      label="Full name"
                      autoFocus
                      error={!!error}
                      helperText={error?.message}
                      {...field}
                      inputRef={field.ref}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Please enter an email',
                  pattern: {
                    value: emailRegex,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      error={!!error}
                      helperText={error?.message}
                      {...field}
                      inputRef={field.ref}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirm"
                control={control}
                rules={{
                  required: 'Please enter an email',
                  pattern: {
                    value: emailRegex,
                    message: 'Invalid email address',
                  },
                  validate: {
                    confirm(value) {
                      return (
                        value === getValues().email || 'Email should match!'
                      )
                    },
                  },
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextField
                      required
                      fullWidth
                      label="Confirm email"
                      error={!!error}
                      helperText={error?.message}
                      {...field}
                      inputRef={field.ref}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" fullWidth variant="outlined">
                Send
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        onClick={setTrue}
      >
        Request an invite
      </Button>
    </>
  )
}

export default App
