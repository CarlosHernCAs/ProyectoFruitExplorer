package com.fruitexplorer.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.fruitexplorer.R;
import com.fruitexplorer.models.RecipeStep;

import java.util.ArrayList;
import java.util.List;

public class RecipeStepAdapter extends RecyclerView.Adapter<RecipeStepAdapter.StepViewHolder> {

    private List<RecipeStep> steps = new ArrayList<>();

    public void setSteps(List<RecipeStep> steps) {
        this.steps = steps;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public StepViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recipe_step, parent, false);
        return new StepViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull StepViewHolder holder, int position) {
        RecipeStep step = steps.get(position);
        holder.bind(step);
    }

    @Override
    public int getItemCount() {
        return steps.size();
    }

    static class StepViewHolder extends RecyclerView.ViewHolder {
        private final TextView stepNumberTextView;
        private final TextView stepDescriptionTextView;

        public StepViewHolder(@NonNull View itemView) {
            super(itemView);
            stepNumberTextView = itemView.findViewById(R.id.stepNumberTextView);
            stepDescriptionTextView = itemView.findViewById(R.id.stepDescriptionTextView);
        }

        public void bind(RecipeStep step) {
            stepNumberTextView.setText(String.valueOf(step.getStepNumber()));
            stepDescriptionTextView.setText(step.getDescription());
        }
    }
}