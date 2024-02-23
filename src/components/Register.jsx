import { useState, useCallback } from 'react';
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/users', formData);
      if (response.status === 200) {
        onRegisterSuccess();
        navigate('/signin');
        toast({
          title: 'ลงทะเบียนสำเร็จ',
          description: "คุณได้เข้าสู่ระบบแล้ว",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('การลงทะเบียนล้มเหลว โปรดลองอีกครั้งในภายหลัง');
    }
  }, [formData, navigate, onRegisterSuccess, toast]);

  return (
    <ChakraProvider>
      <Box p={8} maxWidth="500px" mx="auto">
        <Heading as="h1" mb={6} textAlign="center">
          ลงทะเบียนผู้ใช้ใหม่
        </Heading>
        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>ข้อผิดพลาด!</AlertTitle>
              <AlertDescription display="block">{error}</AlertDescription>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError('')} />
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="name">
              <FormLabel>ชื่อ</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="ชื่อ"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>อีเมล</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="อีเมล"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>รหัสผ่าน</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="รหัสผ่าน"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">
              ลงทะเบียน
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
}

Register.propTypes = {
  onRegisterSuccess: PropTypes.func.isRequired,
};

export default Register;
