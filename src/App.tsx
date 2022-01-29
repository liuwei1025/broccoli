import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogTitle,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { useBoolean, useRequest } from 'ahooks'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import service from './service'
import { emailRegex } from './util'

function Header() {
  return (
    <Container
      component="header"
      sx={{
        display: 'flex',
        height: 64,
        alignItems: 'center',
      }}
    >
      <Typography component="h2" variant="h5">
        Broccoli &amp; Co.
      </Typography>
    </Container>
  )
}
// TODO 此处year最好是从服务端获取
const year = new Date().getFullYear()
function Footer() {
  return (
    <Typography color="text.secondary" align="center" whiteSpace="pre">
      {`©${year}`}
      <Link href="#" sx={{ m: 1 }}>
        Broccoli &amp; Co.
      </Link>
      {`All rights reserved.`}
    </Typography>
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
  const {
    loading,
    run: onSubmit,
    data,
    mutate,
  } = useRequest(
    async (data: FormValues) => {
      try {
        const { data: res } = await service.post('/prod/fake-auth', {
          name: data.name,
          email: data.email,
        })
        return res
      } catch (e: any) {
        return e.response?.data
      }
    },
    { manual: true }
  )
  const showRemoteError = !loading && data?.errorMessage
  const registered = data === 'Registered'
  // reset the form and the last response when close the dialog
  useEffect(() => {
    if (!open) {
      reset()
      mutate()
    }
  }, [open, reset, mutate])
  return (
    <>
      <Dialog
        onClose={setFalse}
        open={open}
        aria-describedby="Request an invite"
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <i>{registered ? 'All done!' : 'Request an invite'}</i>
        </DialogTitle>
        {registered ? (
          <Box sx={{ p: 6, pt: 1 }}>
            <Box
              sx={{
                color: 'text.secondary',
                whiteSpace: 'break-spaces',
                textAlign: 'center',
              }}
            >{`You will be the one of the first to experience\nBroccoli & Co. when we launch.`}</Box>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 4 }}
              onClick={setFalse}
            >
              OK
            </Button>
          </Box>
        ) : (
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
                        inputProps={{ 'data-testid': 'name' }}
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
                        inputProps={{ 'data-testid': 'email' }}
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
                        inputProps={{ 'data-testid': 'confirm' }}
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
                <Button
                  disabled={loading}
                  type="submit"
                  fullWidth
                  variant="outlined"
                >
                  {loading ? 'Sending, please wait...' : 'Send'}
                </Button>
              </Grid>
              {showRemoteError && (
                <FormHelperText
                  sx={{
                    color: 'error.main',
                    width: '100%',
                    textAlign: 'center',
                    mt: 1,
                  }}
                >
                  <i>{data.errorMessage}</i>
                </FormHelperText>
              )}
            </Grid>
          </Box>
        )}
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

export default App
