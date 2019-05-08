module Api::V1
  class ListsController < ApplicationController
    before_action :set_list, only: [:show, :update, :destroy]

    # GET /lists
    def index
      per_page = 5
      items = List.page(params[:page]).per(per_page)
      render json: {items: items, per_page: per_page, count_page: items.total_pages, current_page: items.current_page}
    end

    # GET /lists/1
    def show
      render json: @list
    end

    # POST /lists
    def create
      @list = List.new(list_params)

      if @list.save
        render json: @list, status: :created
      else
        render json: @list.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /lists/1
    def update
      if @list.update(list_params)
        render json: @list
      else
        render json: @list.errors, status: :unprocessable_entity
      end
    end

    # DELETE /lists/1
    def destroy
      @list.destroy
      head :no_content, status: :ok
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_list
        @list = List.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def list_params
        params.require(:list).permit(:title, :excerpt, :description, :upvotes)
      end
  end
end