import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { WelcomeModal } from "@/components/ui/welcome-modal";

const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login realizado com sucesso!");
      setShowWelcomeModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Credenciais inválidas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Enext Doc Central</h1>
          <p className="text-gray-600 mt-2">Sistema feito para a enext gerenciar documentos</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center">Bem-vindo(a)</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          {...field}
                          className="h-11 px-3"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            {...field}
                            className="h-11 px-3 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Entrar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 border-gray-300 text-gray-700 font-normal hover:bg-gray-50"
                  onClick={() => {
                    // Add your registration logic here
                  }}
                >
                  Cadastrar
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 border-gray-300 text-gray-700 font-normal hover:bg-gray-50"
                  onClick={() => {
                    // Add your registration logic here
                  }}
                >
                  Cadastrar
                </Button>
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 border-gray-300 text-gray-700 font-normal hover:bg-gray-50"
                  onClick={() => {
                    // Add your registration logic here
                  }}
                >
                  Cadastrar
                </Button>
                  {isLoading ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Entrar
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative mt-8 mb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2 border-gray-300 text-gray-700 font-normal hover:bg-gray-50"
              onClick={() => {
                form.setValue("email", "admin@enextdoc.com");
                form.setValue("password", "admin");
              }}
            >
              Usar credenciais de demonstração
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center pb-6 pt-2">
            <p className="text-sm text-gray-500">
              Versão 1.0 • Enext Document Central
            </p>
          </CardFooter>
        </Card>
      </div>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
};

export default Login;
