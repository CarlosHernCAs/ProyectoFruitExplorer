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
import com.fruitexplorer.models.Region;

import java.util.List;

public class RegionAdapter extends RecyclerView.Adapter<RegionAdapter.RegionViewHolder> {

    private Context context;
    private List<Region> regionList;
    private OnRegionClickListener onRegionClickListener;

    public interface OnRegionClickListener {
        void onRegionClick(Region region);
    }

    public RegionAdapter(Context context, List<Region> regionList, OnRegionClickListener onRegionClickListener) {
        this.context = context;
        this.regionList = regionList;
        this.onRegionClickListener = onRegionClickListener;
    }

    public void updateRegions(List<Region> newRegionList) {
        this.regionList.clear();
        this.regionList.addAll(newRegionList);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RegionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.list_item_region, parent, false);
        return new RegionViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RegionViewHolder holder, int position) {
        Region region = regionList.get(position);
        holder.regionName.setText(region.getName());

        Glide.with(context)
                .load(region.getImageUrl())
                .into(holder.regionImage);

        holder.itemView.setOnClickListener(v -> {
            if (onRegionClickListener != null) {
                onRegionClickListener.onRegionClick(region);
            }
        });
    }

    @Override
    public int getItemCount() {
        return regionList.size();
    }

    public static class RegionViewHolder extends RecyclerView.ViewHolder {
        ImageView regionImage;
        TextView regionName;

        public RegionViewHolder(@NonNull View itemView) {
            super(itemView);
            regionImage = itemView.findViewById(R.id.regionImageView);
            regionName = itemView.findViewById(R.id.regionNameTextView);
        }
    }
}
