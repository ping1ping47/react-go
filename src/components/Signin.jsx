import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignIn({ onLoginSuccess }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changingEmail, setChangingEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        Email: email,
        Password: password,
      });

      if (response.data.message === "success") {
        const userDataResponse = await axios.get(`http://localhost:5000/users/${email}`);
        const userData = userDataResponse.data;
        onLoginSuccess(userData.Name);
        localStorage.setItem('loggedInUser', email);
        navigate('/');
        toast({
          title: 'Login successful.',
          description: "You're now logged in.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to login. Please try again later.');
    }
  };

  const handleChangePassword = async () => {
    setError(''); // Clear previous errors
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    try {
      const response = await axios.put('http://localhost:5000/users/Changepassword', {
        email: changingEmail,
        currentPassword: password,
        newPassword: newPassword,
      });
  
      if (response.data.message === "success") {
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsModalOpen(false); // Close the modal after changing password
        setError(''); // Clear any previous errors
        toast({
          title: 'Password changed successfully.',
          description: "You've successfully changed your password.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError('Failed to change password. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/signin');
  };

  const handleModalOpen = (email) => {
    setIsModalOpen(true);
    setChangingEmail(email);
  };

  return (
    <ChakraProvider>
      <Box p={8} maxWidth="500px" mx="auto">
        <Heading as="h1" mb={6} textAlign="center">
          เข้าสู่ระบบ
        </Heading>
        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription display="block">{error}</AlertDescription>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError('')} />
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="email">
              <FormLabel>อีเมล</FormLabel>
              <Input
                type="email"
                placeholder="กรอก อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>รหัสผ่าน</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {isChangingPassword && (
              <>
                <FormControl id="newPassword">
                  <FormLabel>รหัสผ่านใหม่</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="รหัสผ่านใหม่"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl id="confirmPassword">
                  <FormLabel>ยืนยันรหัสผ่านใหม่อีกครั้ง</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button colorScheme="blue" onClick={handleChangePassword} width="full">
                  บันทึกรหัสผ่านใหม่
                </Button>
              </>
            )}

            {!isChangingPassword && (
              <Text
                color="blue.500"
                onClick={() => handleModalOpen(email)}
                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                เปลี่ยนรหัสผ่าน
              </Text>
            )}

            <Button colorScheme="blue" onClick={handleSubmit} width="full">
              เข้าสู่ระบบ
            </Button>
          </VStack>
        </form>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>เปลี่ยนรหัสผ่าน</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="email">
                <FormLabel>อีเมลของคุณ</FormLabel>
                <Input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  value={changingEmail}
                  onChange={(e) => setChangingEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="newPassword">
                <FormLabel>รหัสผ่านใหม่</FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="รหัสผ่านใหม่"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="confirmPassword">
                <FormLabel>ยืนยันรหัสผ่านใหม่อีกครั้ง</FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleChangePassword}>
                บันทึก
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}

SignIn.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default SignIn;
