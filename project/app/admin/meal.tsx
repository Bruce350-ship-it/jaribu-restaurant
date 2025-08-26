import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axiosClient from "@/api/axiosClient";
import { router } from "expo-router";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/menu");
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create or Update Meal
  const saveMeal = async () => {
    try {
      if (isEditing) {
        const res = await axiosClient.put(`/api/menu/${form.id}`, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image: form.image,
        });
        setMeals((prev) =>
          prev.map((m) => (m.id === form.id ? res.data : m))
        );
      } else {
        const res = await axiosClient.post("/api/menu", {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image: form.image,
        });
        setMeals((prev) => [res.data, ...prev]);
      }

      // reset form
      setForm({ id: "", name: "", description: "", price: "", image: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving meal:", err);
    }
  };

  // 🔹 Edit
  const startEdit = (meal: Meal) => {
    setForm({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      image: meal.image || "",
    });
    setIsEditing(true);
  };

  // 🔹 Delete
  const deleteMeal = async (id: string) => {
    try {
      await axiosClient.delete(`/api/menu/${id}`);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  // 🔹 Toggle availability
  const updateAvailability = async (id: string, available: boolean) => {
    try {
      await axiosClient.put(`/api/menu/${id}`, { available });
      setMeals((prev) =>
        prev.map((m) => (m.id === id ? { ...m, available } : m))
      );
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Meals Management</Text>
        <TouchableOpacity onPress={() => router.replace('/admin')}>
          <Text className="text-lg font-bold">Done</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View className="bg-white p-4 rounded-xl shadow mb-6">
        <Text className="text-lg font-semibold mb-2">
          {isEditing ? "Edit Meal" : "Add New Meal"}
        </Text>
        <TextInput
          placeholder="Name"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
          className="border p-2 mb-2 rounded"
        />
        <TextInput
          placeholder="Description"
          value={form.description}
          onChangeText={(t) => setForm({ ...form, description: t })}
          className="border p-2 mb-2 rounded"
        />
        <TextInput
          placeholder="Price"
          value={form.price}
          keyboardType="numeric"
          onChangeText={(t) => setForm({ ...form, price: t })}
          className="border p-2 mb-2 rounded"
        />
        <TextInput
          placeholder="Image URL"
          value={form.image}
          onChangeText={(t) => setForm({ ...form, image: t })}
          className="border p-2 mb-2 rounded"
        />
        <Button
          title={isEditing ? "Update Meal" : "Create Meal"}
          onPress={saveMeal}
        />
      </View>

      {/* Meals List */}
      {meals.map((meal) => (
        <View
          key={meal.id}
          className="flex-row items-center justify-between bg-white rounded-xl shadow-sm p-4 mb-3"
        >
          <View className="flex-1">
            <Text className="text-lg font-semibold">{meal.name}</Text>
            <Text className="text-gray-600">${meal.price}</Text>
            <Text className="text-gray-400 text-sm">{meal.description}</Text>
          </View>

          {/* Availability Switch */}
          <Switch
            value={meal.available}
            onValueChange={(val) => updateAvailability(meal.id, val)}
          />

          {/* Edit/Delete Buttons */}
          <View className="ml-4">
            <TouchableOpacity onPress={() => startEdit(meal)}>
              <Text className="text-blue-500 mb-2">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteMeal(meal.id)}>
              <Text className="text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}