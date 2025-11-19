package com.fruitexplorer.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.models.Recipe;
import java.util.ArrayList;
import java.util.List;

public class RecipeAdapter extends RecyclerView.Adapter<RecipeAdapter.RecipeViewHolder> {

    public interface OnRecipeClickListener {
        void onRecipeClick(Recipe recipe);
    }

    private List<Recipe> recipes;
    private final Context context;
    private final OnRecipeClickListener listener;

    public RecipeAdapter(Context context, List<Recipe> recipes, OnRecipeClickListener listener) {
        this.context = context;
        this.recipes = recipes;
        this.listener = listener;
    }

    public void updateRecipes(List<Recipe> recipes) {
        if (recipes != null) {
            this.recipes = recipes;
            notifyDataSetChanged();
        } else {
            this.recipes.clear();
            notifyDataSetChanged();
        }
    }

    @NonNull
    @Override
    public RecipeViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_recipe, parent, false);
        return new RecipeViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecipeViewHolder holder, int position) {
        Recipe recipe = recipes.get(position);
        holder.bind(recipe, listener);
    }

    @Override
    public int getItemCount() {
        return recipes.size();
    }

    class RecipeViewHolder extends RecyclerView.ViewHolder {
        ImageView recipeImageView;
        TextView recipeNameTextView;
        TextView recipeTimeTextView;

        public RecipeViewHolder(@NonNull View itemView) {
            super(itemView);
            recipeImageView = itemView.findViewById(R.id.recipeImageView);
            recipeNameTextView = itemView.findViewById(R.id.recipeNameTextView);
            recipeTimeTextView = itemView.findViewById(R.id.recipeTimeTextView);
        }

        public void bind(final Recipe recipe, final OnRecipeClickListener listener) {
            recipeNameTextView.setText(recipe.getTitle());
            recipeTimeTextView.setVisibility(View.GONE);
            Glide.with(context).load(recipe.getImageUrl()).into(recipeImageView);
            itemView.setOnClickListener(v -> listener.onRecipeClick(recipe));
        }
    }
}