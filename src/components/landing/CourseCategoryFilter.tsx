"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseItem {
  id: string;
  title: string;
  description: string;
  category?: string;
}

interface CourseCategoryFilterProps {
  initialCourses: CourseItem[];
}

const CATEGORIES = ["All", "Foundation", "SSC", "Railway", "State Police"];

export function CourseCategoryFilter({ initialCourses }: CourseCategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredCourses = React.useMemo(() => {
    if (selectedCategory === "All") return initialCourses;
    return initialCourses.filter((course) => {
      const cat = (course.category || "").toLowerCase();
      const target = selectedCategory.toLowerCase();
      return cat.includes(target) || (course.title || "").toLowerCase().includes(target);
    });
  }, [initialCourses, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                isSelected
                  ? "bg-primary text-white shadow-sm dark:bg-accent dark:text-slate-950 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(filteredCourses.length > 0 ? filteredCourses : initialCourses).map((course) => (
          <Card
            key={course.id}
            className="flex flex-col hover:border-primary/50 dark:hover:border-accent/40 hover:shadow-lg transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {course.category || "General"}
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Active Batch
                </span>
              </div>
              <CardTitle className="line-clamp-2 text-base sm:text-lg">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <CardDescription className="line-clamp-3 text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {course.description}
              </CardDescription>
              <Link href={`/courses/${course.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>View Course Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
