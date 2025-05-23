import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const carouselItems = [
  {
    title: "Bem-vindo ao Enext Doc Central",
    description: "Gerencie seus documentos de forma simples e eficiente.",
    image: "/welcome-1.svg",
  },
  {
    title: "Organize seus Documentos",
    description: "Categorize e encontre facilmente todos os seus arquivos.",
    image: "/welcome-2.svg",
  },
  {
    title: "Colabore com sua Equipe",
    description: "Compartilhe e trabalhe em documentos em tempo real.",
    image: "/welcome-3.svg",
  },
  {
    title: "Fique por dentro das novidades",
    description: "Cadastre-se para receber atualizações e dicas exclusivas.",
    type: "form",
  },
];

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulando envio para API fictícia
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sucesso!",
        description: "Seus dados foram cadastrados com sucesso.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    if (currentSlide === carouselItems.length - 1) {
      handleSubmit();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselItems.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {item.type === "form" ? (
                        <div className="space-y-4 w-full max-w-sm">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {item.title}
                          </h2>
                          <p className="text-gray-600">{item.description}</p>
                          <div className="space-y-3">
                            <Input
                              type="email"
                              placeholder="Seu e-mail"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                              type="tel"
                              placeholder="Seu telefone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-48 h-48 mb-4">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {item.title}
                          </h2>
                          <p className="text-gray-600">{item.description}</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <div className="absolute bottom-4 left-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 right-4">
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              {currentSlide === carouselItems.length - 1 ? (
                isSubmitting ? "Enviando..." : "Cadastrar"
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}