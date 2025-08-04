
"use client";

import React, { useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, BookOpen, User, MessageCircle, Award } from "lucide-react";


export default function BookReviewStages() {
  const [currentStage, setCurrentStage] = useState(1);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  // Guardar reseñas localmente
  const [reviews, setReviews] = useState<{ id: number; description: string; rank: number }[]>([]);

  const books = [
    {
      id: 3,
      title: "The Prince",
      author: "Niccolò Machiavelli",
      image: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/El_principe-Nicolas_Maquiavelo-lg.png`,
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
    {
      id: 2,
      title: "The Meditations",
      author: "Marcus Aurelius Antoninus",
      image: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/Las_meditaciones_de_Marco_Aurelio-Marco_Aurelio-lg.png`,
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      id: 1,
      title: "The Art of War",
      author: "Sun Tzu",
      image: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/El_arte_de_la_guerra-Sun_Tzu-lg.png`,
      color: "from-emerald-400 to-teal-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
  ];

  const currentBook = books[currentStage - 1];
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guardar la reseña localmente
    const newReview = {
      id: currentStage,
      description: comment,
      rank: rating,
    };
    setReviews((prev) => {
      // Si ya existe una reseña para este id, reemplazarla
      const filtered = prev.filter((r) => r.id !== currentStage);
      return [...filtered, newReview].sort((a, b) => a.id - b.id);
    });

    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
      setComment("");
      setRating(0);
    } else {
      setSending(true);
      setSendError(null);
      setSendSuccess(false);
      // Al finalizar los 3, enviar el POST
      try {
        const response = await fetch("https://backtosheets.onrender.com/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            items: [
              ...reviews.filter((r) => r.id !== currentStage),
              newReview,
            ].sort((a, b) => a.id - b.id),
          }),
        });
        if (!response.ok) throw new Error("Error en la petición");
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 2500);
      } catch (error) {
        setSendError("Error al enviar los datos: " + error);
      }
      setSending(false);
      setCurrentStage(1);
      setName("");
      setComment("");
      setRating(0);
      setReviews([]);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition-all duration-200 hover:scale-125 active:scale-110"
          >
            <Star
              className={`w-10 h-10 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${currentBook.bgColor} px-4 py-6 sm:py-12`}
    >
      {/* Mensaje visual de envío */}
      {sending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <span className="text-2xl animate-bounce">⏳</span>
            <span className="font-semibold text-lg text-gray-700">Enviando tus reseñas...</span>
          </div>
        </div>
      )}
      {sendSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="font-semibold text-lg text-green-700">¡Reseñas enviadas con éxito!</span>
          </div>
        </div>
      )}
      {sendError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <span className="text-2xl">❌</span>
            <span className="font-semibold text-lg text-red-700">{sendError}</span>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto">
        {/* Header con progreso */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-gray-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Book Reviews
            </h1>
          </div>

          {/* Indicador de progreso mejorado */}
          <div className="flex justify-center gap-3 mb-2">
            {[1, 2, 3].map((stage) => (
              <div key={stage} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    stage === currentStage
                      ? `bg-gradient-to-r ${currentBook.color} text-white shadow-lg scale-110`
                      : stage < currentStage
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stage}
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {stage === 1 ? "Info" : stage === 2 ? "Review" : "Final"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card principal */}
        <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/90">
          <CardHeader
            className={`bg-gradient-to-r ${currentBook.color} text-white p-6`}
          >
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1">{currentBook.title}</h2>
              <p className="text-white/90 text-sm">por {currentBook.author}</p>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Imagen del libro */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={currentBook.image || "/placeholder.svg"}
                  alt={`Portada de ${currentBook.title}`}
                  width={140}
                  height={180}
                  className="rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-lg">
                    {currentStage === 1
                      ? "👤"
                      : currentStage === 2
                      ? "💭"
                      : "⭐"}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input de nombre - solo en la primera etapa */}
              {currentStage === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      ¿Cómo te llamas?
                    </label>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre aquí..."
                    required
                    className="w-full h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-400 transition-colors"
                  />
                </div>
              )}

              {/* Text area para comentario */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <label
                    htmlFor="comment"
                    className="text-sm font-semibold text-gray-700"
                  >
                    ¿Qué opinas de este libro?
                  </label>
                </div>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comparte tus pensamientos..."
                  required
                  rows={4}
                  className="w-full text-base rounded-xl border-2 border-gray-200 focus:border-purple-400 transition-colors resize-none"
                />
              </div>

              {/* Sistema de puntuación */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Tu puntuación
                  </label>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  {renderStars()}
                  <div className="text-center">
                    <span className="text-lg font-medium text-gray-700">
                      {rating > 0 ? (
                        <span className="flex items-center justify-center gap-2">
                          <span>{rating}</span>
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-500">de 5</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          Toca las estrellas para puntuar
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de enviar */}
              <Button
                type="submit"
                className={`w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r ${currentBook.color} hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-white border-0`}
                disabled={
                  rating === 0 ||
                  comment.trim() === "" ||
                  (currentStage === 1 && name.trim() === "")
                }
              >
                {currentStage === 3 ? "🎉 Finalizar" : "➡️ Siguiente libro"}
              </Button>
            </form>

            {/* Información adicional */}
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-600">
                Libro {currentStage} de 3
              </div>
              {currentStage === 1 && name && (
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-purple-700 font-medium">
                    ¡Hola {name}! 👋
                  </p>
                  <p className="text-purple-600 text-sm">
                    Vamos a reseñar algunos libros clásicos
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer chill */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>📖 Comparte tu amor por los libros ✨</p>
        </div>
      </div>
    </div>
  );
}
